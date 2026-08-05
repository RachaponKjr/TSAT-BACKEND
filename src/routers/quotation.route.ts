import { Router } from 'express';
import {
  createQuotationReportController,
  getQuotationReportsController,
  getQuotationReportByIdController,
  updateQuotationReportController,
  deleteQuotationReportController,
  getQuotationNumber,
  getQuotationInfoController,
  getPdfQuotationController
} from '../controllers/quotation/quotation-report.controller';
import {
  createQuotationItemController,
  getQuotationItemsController,
  getQuotationItemByIdController,
  updateQuotationItemController,
  deleteQuotationItemController,
  getQuotationItemByQuotationIdController
} from '../controllers/quotation/quotation-item.controller';
import {
  createReferenceController,
  getReferencesController,
  getReferenceByIdController,
  updateReferenceController,
  deleteReferenceController
} from '../controllers/quotation/quotation-reference.controller';
import { authenticateToken, isMechanic } from '../middlewares/auth-admin';

const router = Router();

// Quotation Report
router.post(
  '/create',
  authenticateToken,
  isMechanic,
  createQuotationReportController
);
router.get('/', getQuotationReportsController);
router.get('/number', authenticateToken, isMechanic, getQuotationNumber);
router.get(
  '/quotation-info/:id',
  authenticateToken,
  isMechanic,
  getQuotationInfoController
);
router.get(
  '/:id',
  authenticateToken,
  isMechanic,
  getQuotationReportByIdController
);
router.patch(
  '/update/:id',
  authenticateToken,
  isMechanic,
  updateQuotationReportController
);
router.delete(
  '/delete/:id',
  authenticateToken,
  isMechanic,
  deleteQuotationReportController
);

// Quotation Report Items
router.post(
  '/items/create',
  authenticateToken,
  isMechanic,
  createQuotationItemController
);
router.get(
  '/items',
  authenticateToken,
  isMechanic,
  getQuotationItemsController
);
router.get(
  '/items/:id',
  authenticateToken,
  isMechanic,
  getQuotationItemByIdController
);
router.get(
  '/item/quotation/:id',
  authenticateToken,
  isMechanic,
  getQuotationItemByQuotationIdController
);
router.patch(
  '/items/update/:id',
  authenticateToken,
  isMechanic,
  updateQuotationItemController
);
router.delete(
  '/items/delete/:id',
  authenticateToken,
  isMechanic,
  deleteQuotationItemController
);

// Quotation Report References
router.post(
  '/references/create',
  authenticateToken,
  isMechanic,
  createReferenceController
);
router.get(
  '/references',
  authenticateToken,
  isMechanic,
  getReferencesController
);
router.get(
  '/references/:id',
  authenticateToken,
  isMechanic,
  getReferenceByIdController
);
router.patch(
  '/references/update/:id',
  authenticateToken,
  isMechanic,
  updateReferenceController
);
router.delete(
  '/references/delete/:id',
  authenticateToken,
  isMechanic,
  deleteReferenceController
);

router.get(
  '/quotation-pdf/:id',
  authenticateToken,
  isMechanic,
  getPdfQuotationController
);

export default router;
