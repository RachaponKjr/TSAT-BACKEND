import { Router } from 'express';
import {
  delReportController,
  getReportByIdController,
  getReportFullController,
  openReportController,
  updateReportController
} from '../controllers/report-main.controller';
import {
  getReportCategoryByIdController,
  getReportCategoryListController
} from '../controllers/report-category.controller';
import {
  getItemReportController,
  updateItemReportController
} from '../controllers/report-item.controller';
import {
  getScoreReportListController,
  selectScoreOptionController,
  updateScoreReportController
} from '../controllers/report-score.controller';
import {
  createTemplateController,
  deactivateTemplateController,
  getTemplateByIdController,
  getTemplateListController
} from '../controllers/report-template.controller';

const route = Router();

// REPORT (InspectionReport) — เปิดใบใหม่จะ auto-seed โครงจาก template ทันที
route.post('/open-report', openReportController);
route.get('/report-full', getReportFullController);
route.get('/report/:id', getReportByIdController);
route.patch('/update-report/:id', updateReportController);
route.delete('/del-report/:id', delReportController);

// CATEGORY RESULT — อ่านอย่างเดียว (โครงมาจาก template)
route.get('/list-category', getReportCategoryListController);
route.get('/category/:id', getReportCategoryByIdController);

// ITEM RESULT — แก้ได้แค่รูปภาพ
route.get('/list-item', getItemReportController);
route.patch('/update-item/:id', updateItemReportController);

// CRITERIA RESULT — จุดเดียวที่แก้ score + description ได้จริง
route.get('/list-score', getScoreReportListController);
route.patch('/update-score/:id', updateScoreReportController);
route.patch('/select-score-option/:id', selectScoreOptionController);

// TEMPLATE (admin, ตั้งค่าครั้งเดียว)
route.post('/create-template', createTemplateController);
route.get('/list-template', getTemplateListController);
route.get('/template/:id', getTemplateByIdController);
route.patch('/deactivate-template/:id', deactivateTemplateController);

export default route;
