import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  getCategoryController,
  updateCategoryController
} from '../controllers/CatagoryProductController';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductController
  //   updateProductController
} from '../controllers/ProductController';
import {
  createService,
  deleteServiceController,
  getService,
  updateServiceController
} from '../controllers/ServiceControlle';
import upload from '../libs/upload';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.post(
  '/create-service',
  authenticateToken,
  isOwner,
  upload.array('images', 4),
  createService
);
router.get('/get-service', getService);
router.get('/get-service/:id', getCategoryByIdController);
router.delete(
  '/delete-service/:id',
  authenticateToken,
  isOwner,
  deleteServiceController
);
router.put(
  '/update-service/:id',
  authenticateToken,
  isOwner,
  updateServiceController
);

router.post(
  '/create-product',
  authenticateToken,
  isOwner,
  upload.single('imge'),
  createProductController
);
router.get('/get-product', getProductController);
router.get('/get-product/:id', getProductByIdController);
router.delete(
  '/delete-product/:id',
  authenticateToken,
  isOwner,
  deleteProductController
);
// router.put('/update-product/:id', updateProductController);

export default router;
