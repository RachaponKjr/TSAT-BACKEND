import { Router } from 'express';
import {
  delReportController,
  getReportFullController,
  openReportController,
  updateApproveReportController
} from '../controllers/report/report-used-car.controller';
import {
  createCategoryController,
  deleteCategoryController,
  getReportListByIdController,
  getReportListController,
  updateCategoryController
} from '../controllers/report/report-category.controller';
import {
  createItemReportController,
  deleteItemReportController,
  getItemReportController,
  updateItemReportController
} from '../controllers/report/report-item.controller';
import {
  createScoreReportController,
  deleteScoreReportController,
  getScoreReportListController,
  updateScoreReportController
} from '../controllers/report/report-score.controller';
import {
  createReportMainController,
  deleteReportMainController,
  getReportMainListController,
  updateReportMainController
} from '../controllers/report/report-main.controller';

const route = Router();

//GET REPORT FULL
route.get('/report-full', getReportFullController);

// REPORT INFO
route.post('/open-report', openReportController);
route.patch('/update-report/:id', updateApproveReportController);
route.delete('/del-report/:id', delReportController);

// REPORT MAIN
route.get('/list-report', createReportMainController);
route.get('/list-report/:id', getReportMainListController);
route.patch('/update-report/:id', updateReportMainController);
route.delete('/del-report/:id', deleteReportMainController);

// REPORT DETAIL CATEGORY
route.post('/create-category', createCategoryController);
route.get('/list-category', getReportListController);
route.get('/list-category/:id', getReportListByIdController);
route.patch('/update-category/:id', updateCategoryController);
route.delete('/del-category/:id', deleteCategoryController);

// REPORT ITEMS
route.post('/create-item', createItemReportController);
route.get('/list-item', getItemReportController);
route.patch('/update-item/:id', updateItemReportController);
route.delete('/del-item/:id', deleteItemReportController);

//REPORT SCORE
route.post('/create-score', createScoreReportController);
route.get('/list-score', getScoreReportListController);
route.patch('/update-score/:id', updateScoreReportController);
route.delete('/del-score/:id', deleteScoreReportController);

export default route;
