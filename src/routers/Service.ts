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
  getSubServicesController,
  updateServiceController
} from '../controllers/ServiceControlle';
import upload from '../libs/upload';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
const router = express.Router();

router.post(
  '/create-service',
  authenticateToken,
  isUser,
  upload.array('images', 4),
  createService
);
router.get('/get-service', getService);
router.get('/get-service/:id', getCategoryByIdController);
router.delete(
  '/delete-service/:id',
  authenticateToken,
  isAdmin,
  deleteServiceController
);
router.put(
  '/update-service/:id',
  authenticateToken,
  isUser,
  updateServiceController
);

router.post(
  '/create-sub-service',
  authenticateToken,
  isUser,
  createSubServiceControlle
);

router.get(
  '/get-subservices',
  authenticateToken,
  isUser,
  getSubServicesController
);
router.get('/get-subservice/:id', authenticateToken, isUser, getSubServiceById);
router.delete(
  '/del-sub-service/:id',
  authenticateToken,
  isAdmin,
  delSubServiceController
);

router.post(
  '/create-product',
  authenticateToken,
  isUser,
  upload.single('imge'),
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
// router.put('/update-product/:id', updateProductController);

export default router;
