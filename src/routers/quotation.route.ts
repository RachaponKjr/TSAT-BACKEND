import { Router } from 'express';
import {
  createQuotationReportController,
  getQuotationReportsController,
  getQuotationReportByIdController,
  updateQuotationReportController,
  deleteQuotationReportController,
  getQuotationNumber
} from '../controllers/quotation/quotation-report.controller';
import {
  createQuotationItemController,
  getQuotationItemsController,
  getQuotationItemByIdController,
  updateQuotationItemController,
  deleteQuotationItemController
} from '../controllers/quotation/quotation-item.controller';
import {
  createReferenceController,
  getReferencesController,
  getReferenceByIdController,
  updateReferenceController,
  deleteReferenceController
} from '../controllers/quotation/quotation-reference.controller';

const router = Router();

// Quotation Report
router.post('/create', createQuotationReportController);
router.get('/', getQuotationReportsController);
router.get('/:id', getQuotationReportByIdController);
router.patch('/update/:id', updateQuotationReportController);
router.delete('/delete/:id', deleteQuotationReportController);
router.get('/number', getQuotationNumber);

// Quotation Report Items
router.post('/items/create', createQuotationItemController);
router.get('/items', getQuotationItemsController);
router.get('/items/:id', getQuotationItemByIdController);
router.patch('/items/update/:id', updateQuotationItemController);
router.delete('/items/delete/:id', deleteQuotationItemController);

// Quotation Report References
router.post('/references/create', createReferenceController);
router.get('/references', getReferencesController);
router.get('/references/:id', getReferenceByIdController);
router.patch('/references/update/:id', updateReferenceController);
router.delete('/references/delete/:id', deleteReferenceController);

export default router;
