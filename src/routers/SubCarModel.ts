import express from 'express';
import {
  createSubCarModelController,
  deleteSubCarModelController,
  getSubCarModelByIdController,
  getSubCarModelController
} from '../controllers/SubCarmodelController';
const router = express.Router();

router.post('/create', createSubCarModelController);
router.get('/get', getSubCarModelController);
router.get('/get/:id', getSubCarModelByIdController);
router.delete('/delete/:id', deleteSubCarModelController);

export default router;
