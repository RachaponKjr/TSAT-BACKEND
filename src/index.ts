/* eslint-disable no-duplicate-imports */
/* eslint-disable no-console */
import http from 'http';
import express from 'express';
import { Request } from 'express';
import cors from 'cors';

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
app.use(
  cors({
    origin: '*', // ✅ เปิดให้ทุก origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.options('*', cors());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));
app.use('/public/products', express.static('public/products'));
app.use('/uploads/works', express.static('uploads/works'));
app.use('/uploads/reviews', express.static('uploads/reviews'));
app.use('/uploads/edit-blogs', express.static('uploads/edit-blogs'));
app.use('/uploads/subcarmodel', express.static('uploads/subcarmodel'));

// CMS API
app.use(`${versionApi}/cms`, express.json(), cmsHomeRouter);

app.use(`${versionApi}/car-model`, express.json(), carModelRouter);
app.use(`${versionApi}/sub-car-model`, express.json(), subCarModelRouter);
app.use(`${versionApi}/product`, express.json(), catagoryProductRouter);
app.use(`${versionApi}/service`, express.json(), ServicetRouter);
app.use(`${versionApi}/customer-work`, express.json(), CustormWorkRouter);
app.use(`${versionApi}/customer-review`, express.json(), CustormReviewRouter);
app.use(`${versionApi}/work-service`, express.json(), WorkServiceRouter);
app.use(`${versionApi}/contact`, express.json(), contactRouter);
app.use(`${versionApi}/catagory-service`, express.json(), catagoryService);
app.use(`${versionApi}/user`, express.json(), userRouter);
app.use(`${versionApi}/token`, express.json(), authRouter);

app.use(
  `${versionApi}/category-service`,
  express.json(),
  CategoryServiceRouter
);
app.use(`${versionApi}/edit-blog`, editBlogRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
