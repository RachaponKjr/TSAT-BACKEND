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
  createSubServiceControlle,
  deleteServiceController,
  delSubServiceController,
  getService,
  getSubServiceById,
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
  '/create-sub-service',
  authenticateToken,
  isOwner,
  createSubServiceControlle
);
router.get(
  '/get-subservice/:id',
  authenticateToken,
  isOwner,
  getSubServiceById
);
router.delete(
  '/del-sub-service/:id',
  authenticateToken,
  isOwner,
  delSubServiceController
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
