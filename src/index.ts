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

const app = express();

const PORT = 3130;
const versionApi = '/api/v1';
app.use(cors<Request>());
app.use(express.json());

// CMS API
app.use(`${versionApi}/cms/home`, cmsHomeRouter);
app.use(`${versionApi}/car-model`, carModelRouter);
app.use(`${versionApi}/sub-car-model`, subCarModelRouter);
app.use(`${versionApi}/product`, catagoryProductRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// เรียกดูรูป
app.use('/product/img', express.static('public/products'));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
