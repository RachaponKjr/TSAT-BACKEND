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
  getProductController,
  updateProductController
  //   updateProductController
} from '../controllers/ProductController';
import { upload } from '../middlewares/upload';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
const router = express.Router();

router.post(
  '/create-category',
  authenticateToken,
  isUser,
  upload.single('image'),
  createCategoryController
);
router.get('/get-category', getCategoryController);
router.get('/get-category/:id', getCategoryByIdController);
router.delete(
  '/delete-category/:id',
  authenticateToken,
  isAdmin,
  deleteCategoryController
);
router.put(
  '/update-category/:id',
  authenticateToken,
  isUser,
  upload.single('image'),
  updateCategoryController
);

router.post(
  '/create-product',
  authenticateToken,
  isUser,
  upload.single('image'),
  createProductController
);
router.get('/get-product', getProductController);
router.get('/get-product/:id', getProductByIdController);
router.delete(
  '/delete-product/:id',
  authenticateToken,
  isAdmin,
  deleteProductController
);
router.put(
  '/update-product/:id',
  authenticateToken,
  isUser,
  upload.single('image'),
  updateProductController
);

export default router;
