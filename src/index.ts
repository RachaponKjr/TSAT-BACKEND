/* eslint-disable no-duplicate-imports */
/* eslint-disable no-console */
import http from 'http';
import express, { Request } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

const app = express();
const PORT = 3131;
const versionApi = '/api/v1';

// ✅ CORS: ให้รองรับ cookie-based auth

const allowedOrigins = [
  'http://tsat-front:3030',
  'http://150.95.26.51:3030',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // ถ้าไม่มี origin (เช่น curl หรือ mobile app) ให้ผ่านเลย
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ✅ สำหรับ preflight requests
app.options('*', cors());

// ✅ Middleware ที่ควรอยู่ก่อน route ทุกตัว
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ✅ Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
