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
const router = express.Router();

router.post('/create-category', createCategoryController);
router.get('/get-category', getCategoryController);
router.get('/get-category/:id', getCategoryByIdController);
router.delete('/delete-category/:id', deleteCategoryController);
router.put('/update-category/:id', updateCategoryController);

router.post('/create-product', upload.single('imge'), createProductController);
router.get('/get-product', getProductController);
router.get('/get-product/:id', getProductByIdController);
router.delete('/delete-product/:id', deleteProductController);
// router.put('/update-product/:id', updateProductController);

export default router;
