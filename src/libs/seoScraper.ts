// seoScraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import https from 'https';

const CONCURRENCY = 5;
const TIMEOUT_MS = 8000;

// ✅ shared agent — ใช้ทุก request ไม่ต้องสร้างใหม่ทุกครั้ง
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const ALLOWED_PATHS = [
  '/',
  '/service',
  '/product',
  '/about',
  '/contact',
  '/customer' // ✅ เพิ่มกลับมา — ครอบคลุมทั้ง /customer และ /customer/uuid
];

const BLOCKED_PATHS = [
  '/admin/',
  '/dashboard/',
  '/login/',
  '/server/',
  '/api/',
  '/uploads/',
  '/assets/'
  // ✅ ลบ /customer/ ออกแล้ว
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageSEOResult {
  url: string;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  canonical?: string;
  headings?: { h1: string[]; h2: string[]; h3: string[] };
  links?: { internal: number; external: number };
  content_length?: number;
  content_preview?: string;
  error?: string;
}

// ─── 1. ดึง URL ทั้งหมดจาก Sitemap ───────────────────────────────────────────
async function getAllUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const { data } = await axios.get<string>(sitemapUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/xml, application/xml, */*'
      },
      timeout: 10000,
      httpsAgent
    });

    const $ = cheerio.load(data, { xmlMode: true });
    const allUrls: string[] = [];
    $('url > loc').each((_, el) => {
      allUrls.push($(el).text().trim());
    });

    // ✅ filter ตรงนี้เลย ก่อน return
    const filtered = allUrls.filter((url) => {
      try {
        const path = new URL(url).pathname.replace(/\/$/, '') || '/';
        if (BLOCKED_PATHS.some((b) => path.startsWith(b))) return false;
        return ALLOWED_PATHS.some(
          (a) => path === a || path.startsWith(a + '/')
        );
      } catch {
        return false;
      }
    });

    console.log(
      `📄 sitemap ทั้งหมด: ${allUrls.length} URL → หลัง filter: ${filtered.length} URL`
    );
    return filtered;
  } catch (error) {
    console.error('❌ Sitemap Error:', (error as Error).message);
    return [];
  }
}

// ─── 2. Scrape เนื้อหา SEO จาก 1 หน้า ────────────────────────────────────────
async function scrapePageSEO(url: string): Promise<PageSEOResult> {
  try {
    const { data } = await axios.get<string>(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: TIMEOUT_MS,
      httpsAgent // ✅ แก้จุดนี้ — เดิมไม่มี ทำให้ SSL error ทุกหน้า
    });

    const $ = cheerio.load(data);

    const headings: { h1: string[]; h2: string[]; h3: string[] } = {
      h1: [],
      h2: [],
      h3: []
    };
    $('h1').each((_, el) => {
      headings.h1.push($(el).text().trim());
    });
    $('h2').each((_, el) => {
      headings.h2.push($(el).text().trim());
    });
    $('h3').each((_, el) => {
      headings.h3.push($(el).text().trim());
    });

    $('script, style, nav, footer, iframe, noscript').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const links = { internal: 0, external: 0 };
    const host = new URL(url).hostname;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') ?? '';
      if (href.startsWith('http') && !href.includes(host)) links.external++;
      else if (href.startsWith('/') || href.includes(host)) links.internal++;
    });

    return {
      url,
      meta_title: $('title').text().trim(),
      meta_description: $('meta[name="description"]').attr('content') ?? '',
      og_title: $('meta[property="og:title"]').attr('content') ?? '',
      og_description:
        $('meta[property="og:description"]').attr('content') ?? '',
      canonical: $('link[rel="canonical"]').attr('href') ?? '',
      headings,
      links,
      content_length: bodyText.length,
      content_preview: bodyText.substring(0, 1500)
    };
  } catch (error) {
    return { url, error: `Failed to fetch: ${(error as Error).message}` };
  }
}

// ─── 3. รัน Scraper ทั้งเว็บ ──────────────────────────────────────────────────
async function runFullWebScraper(sitemapUrl: string) {
  let urls = await getAllUrlsFromSitemap(sitemapUrl);

  // ✅ เพิ่ม homepage ถ้ายังไม่มีใน sitemap
  const base = new URL(sitemapUrl).origin;
  if (!urls.includes(base) && !urls.includes(base + '/')) {
    urls = [base, ...urls];
  }

  console.log(`📄 URL ทั้งหมดที่จะ scrape: ${urls.length}`);

  if (urls.length === 0) {
    console.warn('⚠️  ไม่พบ URL');
    return {
      site_overview: {
        total_pages_scraped: 0,
        scraped_at: new Date().toISOString()
      },
      pages: [] as PageSEOResult[]
    };
  }

  console.log(
    `⏱️  เริ่ม scrape ${urls.length} หน้า (concurrency: ${CONCURRENCY})...`
  );

  const limit = pLimit(CONCURRENCY);
  let done = 0;

  const pages = await Promise.all(
    urls.map((url) =>
      limit(async () => {
        const result = await scrapePageSEO(url);
        done++;
        const status = result.error ? '❌' : '✅';
        console.log(`  ${status} [${done}/${urls.length}] ${url}`);
        return result;
      })
    )
  );

  const successCount = pages.filter((p) => !p.error).length;
  const errorCount = pages.filter((p) => p.error).length;
  console.log(`\n✅ Done — ${successCount} สำเร็จ, ${errorCount} error`);

  return {
    site_overview: {
      total_pages_scraped: urls.length,
      success: successCount,
      errors: errorCount,
      scraped_at: new Date().toISOString()
    },
    pages
  };
}

export { runFullWebScraper };
export type { PageSEOResult };
