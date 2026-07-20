import { Router } from 'express';
import {
  delReportController,
  getReportByIdController,
  getReportFullController,
  getReportListController,
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
  deleteTemplateController,
  getCriteriaOptionListController,
  getReportController,
  getTemplateByIdController,
  getTemplateListController,
  updateCategoryController,
  updateCategoryResultController,
  updateCategoryResultRecommendController,
  updateCriteriaController,
  updateItemController,
  updateOptionController,
  updateTemplateController
} from '../controllers/report-template.controller';
import { authenticateToken, isMechanic } from '../middlewares/auth-admin';

const route = Router();

// REPORT (InspectionReport) — เปิดใบใหม่จะ auto-seed โครงจาก template ทันที
route.post('/open-report', authenticateToken, isMechanic, openReportController);
route.get(
  '/report-full',
  authenticateToken,
  isMechanic,
  getReportFullController
);

route.get('/report-list', getReportListController);
route.get(
  '/report/:id',
  authenticateToken,
  isMechanic,
  getReportByIdController
);
route.patch(
  '/update-report/:id',
  authenticateToken,
  isMechanic,
  updateReportController
);
route.delete(
  '/del-report/:id',
  authenticateToken,
  isMechanic,
  delReportController
);

// CATEGORY RESULT — อ่านอย่างเดียว (โครงมาจาก template)
route.get(
  '/list-category',
  authenticateToken,
  isMechanic,
  getReportCategoryListController
);
route.get(
  '/category/:id',
  authenticateToken,
  isMechanic,
  getReportCategoryByIdController
);
route.post(
  '/create-template-category/:templateId',
  authenticateToken,
  isMechanic,
  createCategoryController
);
route.delete(
  '/del-template-category/:id',
  authenticateToken,
  isMechanic,
  deleteCategoryController
);
route.patch(
  '/update-category-result/:id',
  authenticateToken,
  isMechanic,
  updateCategoryResultController
);
route.patch(
  '/update-category-recommend/:id',
  authenticateToken,
  isMechanic,
  updateCategoryResultRecommendController
);

// ITEM RESULT — แก้ได้แค่รูปภาพ
route.get('/list-item', authenticateToken, isMechanic, getItemReportController);
route.patch(
  '/update-item/:id',
  authenticateToken,
  isMechanic,
  updateItemReportController
);

// CRITERIA RESULT — จุดเดียวที่แก้ score + description ได้จริง
route.get(
  '/list-score',
  authenticateToken,
  isMechanic,
  getScoreReportListController
);
route.patch(
  '/update-score/:id',
  authenticateToken,
  isMechanic,
  updateScoreReportController
);
route.patch(
  '/select-score-option',
  authenticateToken,
  isMechanic,
  selectScoreOptionController
);
route.post(
  '/create-template-criteria/:itemId',
  authenticateToken,
  isMechanic,
  createCriteriaController
);
route.delete(
  '/del-template-criteria/:id',
  authenticateToken,
  isMechanic,
  deleteCriteriaController
);
route.get(
  '/criteria-options/:criteriaId',
  authenticateToken,
  isMechanic,
  getCriteriaOptionListController
);

// TEMPLATE (admin, ตั้งค่าครั้งเดียว)
route.post(
  '/create-template',
  authenticateToken,
  isMechanic,
  createTemplateController
);
route.get(
  '/list-template',
  authenticateToken,
  isMechanic,
  getTemplateListController
);
route.get(
  '/template/:id',
  authenticateToken,
  isMechanic,
  getTemplateByIdController
);
route.patch(
  '/deactivate-template/:id',
  authenticateToken,
  isMechanic,
  deactivateTemplateController
);
route.delete(
  '/del-template/:id',
  authenticateToken,
  isMechanic,
  deleteTemplateController
);

// TEMPLATE — แก้ไข
route.patch(
  '/update-template/:id',
  authenticateToken,
  isMechanic,
  updateTemplateController
);
route.patch(
  '/update-template-category/:id',
  authenticateToken,
  isMechanic,
  updateCategoryController
);
route.patch(
  '/update-template-item/:id',
  authenticateToken,
  isMechanic,
  updateItemController
);
route.post(
  '/create-template-item/:categoryId',
  authenticateToken,
  isMechanic,
  createItemController
);
route.delete(
  '/del-template-item/:id',
  authenticateToken,
  isMechanic,
  deleteItemController
);
route.patch(
  '/update-template-criteria/:id',
  authenticateToken,
  isMechanic,
  updateCriteriaController
);
route.patch(
  '/update-template-option/:id',
  authenticateToken,
  isMechanic,
  updateOptionController
);
route.post(
  '/create-template-option/:criteriaId',
  authenticateToken,
  isMechanic,
  createOptionController
);
route.delete(
  '/del-template-option/:id',
  authenticateToken,
  isMechanic,
  deleteOptionController
);

// Report GET

route.get(
  '/get-report/:id',
  authenticateToken,
  isMechanic,
  getReportController
);

export default route;
