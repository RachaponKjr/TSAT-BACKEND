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
import { syncReviewsToDatabase } from './libs/syncReviewsToDatabase';

const app = express();
const PORT = 3131;
const versionApi = '/api/v1';

// ✅ CORS: ให้รองรับ cookie-based auth

const allowedOrigins = [
  'http://tsat-front:3030',
  'http://150.95.26.51:3030',
  'http://localhost:3000',
  'https://topserviceautotechnic.com',
  'http://topserviceautotechnic.com', // เผื่อลูกค้าเข้าแบบไม่มี s
  'https://www.topserviceautotechnic.com', // เผื่อมี www
  'http://www.topserviceautotechnic.com'
];

app.use(logRequest);

app.use(
  cors({
    origin: function (origin, callback) {
      // ถ้าไม่มี origin (เช่น server-to-server) หรือ origin อยู่ในลิสต์
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // แทนที่จะพ่น Error แรงๆ ให้ส่ง false ไปเฉยๆ
        // หรือ console.log ดูว่าตัวที่หลุดมาคือ origin อะไร
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
    optionsSuccessStatus: 204 // สำคัญมาก: Chrome ชอบสถานะนี้สำหรับ OPTIONS
  })
);

// ✅ สำหรับ preflight requests
// app.options('*', cors());

// ✅ Middleware ที่ควรอยู่ก่อน route ทุกตัว
app.use(express.json({ limit: '50mb' })); // 🟢 ต้องระบุลิมิตตรงนี้ด้วย
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ✅ Static file serving
app.use('/uploads', express.static('uploads'));
app.use('/public/products', express.static('public/products'));
app.use('/uploads/works', express.static('uploads/works'));
app.use('/uploads/reviews', express.static('uploads/reviews'));
app.use('/uploads/edit-blogs', express.static('uploads/edit-blogs'));
app.use('/uploads/subcarmodel', express.static('uploads/subcarmodel'));

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

// ✅ Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
