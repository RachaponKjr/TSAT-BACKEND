/* eslint-disable no-duplicate-imports */
/* eslint-disable no-console */
import http from 'http';
import express from 'express';
import { Request } from 'express';
import cors from 'cors';

import cmsHomeRouter from './routers/cms/CmsHomeRouter';
import carModelRouter from './routers/CarModel';
import subCarModelRouter from './routers/SubCarModel';
import catagoryProductRouter from './routers/Product';
import ServicetRouter from './routers/Service';
import CustormWorkRouter from './routers/customer-work';
import CustormReviewRouter from './routers/customer-review';
import WorkServiceRouter from './routers/work-service-route';
import CategoryServiceRouter from './routers/catagory-service-modelcar-router';

const app = express();

const PORT = 3130;
const versionApi = '/api/v1';
app.use(cors<Request>());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/public/products', express.static('public/products'));
app.use('/uploads/works', express.static('uploads/works'));
app.use('/uploads/reviews', express.static('uploads/reviews'));

// CMS API
app.use(`${versionApi}/cms/home`, cmsHomeRouter);
app.use(`${versionApi}/car-model`, carModelRouter);
app.use(`${versionApi}/sub-car-model`, subCarModelRouter);
app.use(`${versionApi}/product`, catagoryProductRouter);
app.use(`${versionApi}/service`, ServicetRouter);
app.use(`${versionApi}/customer-work`, CustormWorkRouter);
app.use(`${versionApi}/customer-review`, CustormReviewRouter);
app.use(`${versionApi}/work-service`, WorkServiceRouter);
app.use(`${versionApi}/category-service`, CategoryServiceRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
