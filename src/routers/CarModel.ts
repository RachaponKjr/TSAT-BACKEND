import express from 'express';
import {
  createCarModelController,
  deleteCarModelController,
  getCarModelByIdController,
  getCarModelController,
  updateCarModelController
} from '../controllers/CarModelController';
const router = express.Router();

router.post('/create', createCarModelController);
router.get('/', getCarModelController);
router.get('/:id', getCarModelByIdController);
router.put('/:id', updateCarModelController);
router.delete('/:id', deleteCarModelController);

export default router;
