/* eslint-disable no-duplicate-imports */
/* eslint-disable no-console */
import http from 'http';
import express, { Request } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import carModelRouter from './routers/CarModel';
import subCarModelRouter from './routers/SubCarModel';
import catagoryProductRouter from './routers/Product';
import ServicetRouter from './routers/Service';
import CustormWorkRouter from './routers/customer-work';
import CustormReviewRouter from './routers/customer-review';
import WorkServiceRouter from './routers/work-service-route';
import CategoryServiceRouter from './routers/catagory-service-modelcar-router';
import editBlogRouter from './routers/blog-router';
import contactRouter from './routers/contact-router';
import cmsHomeRouter from './routers/cms-router';
import catagoryService from './routers/catagory-servie';
import userRouter from './routers/user-route';
import authRouter from './routers/auth-router';
import blogRouter from './routers/new-blog-router';
import seoRouter from './routers/seo-router';
import uploadRouter from './routers/upload-router';
import logRequest from './middlewares/log-req';
import reviewRouter from './routers/review.route';
import pdfRouter from './routers/pdf.route';
import scrapeRouter from './routers/scrape.route';
import reportUsedCarRouter from './routers/report-inspection.route';
import itemsRouter from './routers/items.route';
import quotationRouter from './routers/quotation.route';
import { syncReviewsToDatabase } from './libs/syncReviewsToDatabase';
import { runFullWebScraper } from './libs/seoScraper';
import redisClient from './libs/redis';

const app = express();
const PORT = 3131;
const versionApi = '/api/v1';

// 🟢 1. ย้ายการตั้งค่าขนาดไฟล์ (Body Parser) ขึ้นมาอยู่บนสุด เพื่อให้รับภาพขนาดใหญ่ได้ตั้งแต่แรกสุด
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(logRequest);

const publicStaticCors = cors({ origin: '*' });
const staticOptions = {
  setHeaders: (res: any, path: string, stat: any) => {
    // เพิ่ม Header นี้เพื่อให้ Safari บน iOS ยอมรับการโหลดรูปภาพข้ามโดเมน
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
};

// ✅ Static file serving
app.use('/uploads', publicStaticCors, express.static('uploads', staticOptions));
app.use(
  '/public/products',
  publicStaticCors,
  express.static('public/products', staticOptions)
);
app.use(
  '/uploads/works',
  publicStaticCors,
  express.static('uploads/works', staticOptions)
);
app.use(
  '/uploads/reviews',
  publicStaticCors,
  express.static('uploads/reviews', staticOptions)
);
app.use(
  '/uploads/edit-blogs',
  publicStaticCors,
  express.static('uploads/edit-blogs', staticOptions)
);
app.use(
  '/uploads/subcarmodel',
  publicStaticCors,
  express.static('uploads/subcarmodel', staticOptions)
);

// 🟢 2. ปรับการตั้งค่า CORS หลังบ้านให้ยืดหยุ่นและปลอดภัยร่วมกับ Credentials
const allowedOrigins = [
  'http://tsat-front:3030',
  'http://150.95.26.51:3030',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://topserviceautotechnic.com',
  'https://www.topserviceautotechnic.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // ปรับให้ใจกว้างขึ้น: ถ้าไม่มี origin หรือถูกส่งผ่านเครื่องมือทดสอบ ยอมให้ผ่าน
      if (
        !origin ||
        origin === 'null' ||
        allowedOrigins.indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        // แทนที่จะสั่ง throw Error โหดๆ ซึ่งจะทำให้บราวเซอร์ติด CORS
        // ให้ส่งค่า false กลับไปเพื่อให้ตัวแพ็กเกจปฏิเสธอย่างนุ่มนวลตามมาตรฐาน
        console.log('Blocked by CORS:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// ✅ Routes
app.use(`${versionApi}/cms`, cmsHomeRouter);
app.use(`${versionApi}/car-model`, carModelRouter);
app.use(`${versionApi}/sub-car-model`, subCarModelRouter);
app.use(`${versionApi}/product`, catagoryProductRouter);
app.use(`${versionApi}/service`, ServicetRouter);
app.use(`${versionApi}/customer-work`, CustormWorkRouter);
app.use(`${versionApi}/customer-review`, CustormReviewRouter);
app.use(`${versionApi}/work-service`, WorkServiceRouter);
app.use(`${versionApi}/contact`, contactRouter);
app.use(`${versionApi}/catagory-service`, catagoryService);
app.use(`${versionApi}/user`, userRouter);
app.use(`${versionApi}/token`, authRouter);
app.use(`${versionApi}/category-service-car`, CategoryServiceRouter);
app.use(`${versionApi}/edit-blog`, editBlogRouter);
app.use(`${versionApi}/blog`, blogRouter);
app.use(`${versionApi}/seo`, seoRouter);
app.use(`${versionApi}/upload`, uploadRouter);
app.use(`${versionApi}/review`, reviewRouter);
app.use(`${versionApi}/pdf`, pdfRouter);
app.use(`${versionApi}/scrape`, scrapeRouter);
app.use(`${versionApi}/report-used-car`, reportUsedCarRouter);
app.use(`${versionApi}/items`, itemsRouter);
app.use(`${versionApi}/quotation`, quotationRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

cron.schedule(
  '0 0 * * 1',
  () => {
    syncReviewsToDatabase();
  },
  {
    timezone: 'Asia/Bangkok'
  }
);

cron.schedule('0 2 * * *', async () => {
  console.log('🕑 Auto re-scrape started...');
  const result = await runFullWebScraper(
    'https://topserviceautotechnic.com/sitemap.xml'
  );
  await redisClient.set('tsat:seo:content', JSON.stringify(result), {
    EX: 60 * 60 * 25
  });
  console.log('✅ Auto re-scrape done');
});

// ✅ Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
