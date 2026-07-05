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
  createCategoryController,
  createCriteriaController,
  createItemController,
  createOptionController,
  createTemplateController,
  deactivateTemplateController,
  deleteCategoryController,
  deleteCriteriaController,
  deleteItemController,
  deleteOptionController,
  getCriteriaOptionListController,
  getTemplateByIdController,
  getTemplateListController,
  updateCategoryController,
  updateCriteriaController,
  updateItemController,
  updateOptionController,
  updateTemplateController
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
route.post('/create-template-category/:templateId', createCategoryController);
route.delete('/del-template-category/:id', deleteCategoryController);

// ITEM RESULT — แก้ได้แค่รูปภาพ
route.get('/list-item', getItemReportController);
route.patch('/update-item/:id', updateItemReportController);

// CRITERIA RESULT — จุดเดียวที่แก้ score + description ได้จริง
route.get('/list-score', getScoreReportListController);
route.patch('/update-score/:id', updateScoreReportController);
route.patch('/select-score-option/:id', selectScoreOptionController);
route.post('/create-template-criteria/:itemId', createCriteriaController);
route.delete('/del-template-criteria/:id', deleteCriteriaController);
route.get('/criteria-options/:criteriaId', getCriteriaOptionListController);

// TEMPLATE (admin, ตั้งค่าครั้งเดียว)
route.post('/create-template', createTemplateController);
route.get('/list-template', getTemplateListController);
route.get('/template/:id', getTemplateByIdController);
route.patch('/deactivate-template/:id', deactivateTemplateController);

// TEMPLATE — แก้ไข
route.patch('/update-template/:id', updateTemplateController);
route.patch('/update-template-category/:id', updateCategoryController);
route.patch('/update-template-item/:id', updateItemController);
route.post('/create-template-item/:categoryId', createItemController);
route.delete('/del-template-item/:id', deleteItemController);
route.patch('/update-template-criteria/:id', updateCriteriaController);
route.patch('/update-template-option/:id', updateOptionController);
route.post('/create-template-option/:criteriaId', createOptionController);
route.delete('/del-template-option/:id', deleteOptionController);

export default route;
