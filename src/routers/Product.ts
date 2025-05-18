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
import { upload } from '../middlewares/upload';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.post(
  '/create-category',
  authenticateToken,
  isOwner,
  upload.single('image'),
  createCategoryController
);
router.get('/get-category', getCategoryController);
router.get('/get-category/:id', getCategoryByIdController);
router.delete(
  '/delete-category/:id',
  authenticateToken,
  isOwner,
  deleteCategoryController
);
router.put(
  '/update-category/:id',
  authenticateToken,
  isOwner,
  updateCategoryController
);

router.post(
  '/create-product',
  authenticateToken,
  isOwner,
  upload.single('image'),
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
