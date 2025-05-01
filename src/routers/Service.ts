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
import { createService, getService } from '../controllers/ServiceControlle';
import upload from '../libs/upload';
const router = express.Router();

router.post('/create-service', upload.array('images', 4), createService);
router.get('/get-service', getService);
router.get('/get-service/:id', getCategoryByIdController);
router.delete('/delete-service/:id', deleteCategoryController);
router.put('/update-service/:id', updateCategoryController);

router.post('/create-product', upload.single('imge'), createProductController);
router.get('/get-product', getProductController);
router.get('/get-product/:id', getProductByIdController);
router.delete('/delete-product/:id', deleteProductController);
// router.put('/update-product/:id', updateProductController);

export default router;
