/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/scrape.route.js
import express from 'express';
import { runFullWebScraper } from '../libs/seoScraper';
import redisClient from '../libs/redis';

const router = express.Router();

const CACHE_KEY = 'tsat:seo:content';
const CACHE_TTL = 60 * 60 * 24; // 24 ชั่วโมง

router.post('/', async (req, res) => {
  const result = await runFullWebScraper(
    'https://topserviceautotechnic.com/sitemap.xml'
  );

  // เก็บลง Redis เป็น JSON string
  await redisClient.set(CACHE_KEY, JSON.stringify(result), { EX: CACHE_TTL });

  res.json({
    message: 'done',
    total: result.site_overview.total_pages_scraped
  });
});

// GET /content — อ่านจาก Redis เลย ไม่ต้อง scrape ใหม่
router.get('/content', async (req, res) => {
  const cached = await redisClient.get(CACHE_KEY);
  if (!cached) {
    res
      .status(404)
      .json({ message: 'ยังไม่มีข้อมูล กรุณา POST /scrape ก่อนครับ' });
    return; // ← แยก return ออกมา
  }
  res.json(JSON.parse(cached));
});

// GET /content/txt — format เป็น plain text สำหรับยัดใส่ AI prompt
router.get('/content/txt', async (req, res) => {
  const cached = await redisClient.get(CACHE_KEY);
  if (!cached) {
    res.status(404).json({ message: 'ยังไม่มีข้อมูล' });
    return;
  }
  const data = JSON.parse(cached);
  const txt = data.pages
    .filter((p: any) => !p.error)
    .map(
      (p: any) => `URL: ${p.url}
TITLE: ${p.meta_title}
DESC: ${p.meta_description}
H1: ${p.headings?.h1?.join(' | ')}
CONTENT: ${p.content_preview}`
    )
    .join('\n\n---\n\n');

  res.type('text/plain; charset=utf-8').send(txt);
});
export default router;
