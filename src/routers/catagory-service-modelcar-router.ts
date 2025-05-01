import express from 'express';
import {
  categoryServiceModelCar,
  createCatagoryService
} from '../controllers/catagory-service-modelcar-controller';
const router = express.Router();

router.post('/create', categoryServiceModelCar);
router.post('/create-service', createCatagoryService);

export default router;
