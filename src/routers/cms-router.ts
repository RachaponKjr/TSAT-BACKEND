import express from 'express';
import {
  getAboutController,
  getCmsHomeController,
  getCmsProductController,
  getCmsServiceController,
  getContactController,
  getCustumersController,
  updateAboutController,
  updateCmsHomeController,
  updateCmsProductController,
  updateCmsServiceController,
  updateContactController,
  updateCustumersController
} from '../controllers/cms-controller';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.get('/get-home', getCmsHomeController);
router.put(
  '/update-home/:id',
  authenticateToken,
  isOwner,
  updateCmsHomeController
);
router.get('/get-service', getCmsServiceController);
router.put(
  '/update-service/:id',
  authenticateToken,
  isOwner,
  updateCmsServiceController
);
router.get('/get-product', getCmsProductController);
router.put(
  '/update-product/:id',
  authenticateToken,
  isOwner,
  updateCmsProductController
);
router.get('/get-customer', getCustumersController);
router.put(
  '/update-customer/:id',
  authenticateToken,
  isOwner,
  updateCustumersController
);
router.get('/get-about', getAboutController);
router.put(
  '/update-about/:id',
  authenticateToken,
  isOwner,
  updateAboutController
);
router.get('/get-contact', getContactController);
router.put(
  '/update-contact/:id',
  authenticateToken,
  isOwner,
  updateContactController
);
export default router;
