import express from 'express';
import {
  categoryServiceModelCar,
  createCatagoryService
} from '../controllers/catagory-service-modelcar-controller';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.post('/create', authenticateToken, isOwner, categoryServiceModelCar);
router.post(
  '/create-service',
  authenticateToken,
  isOwner,
  createCatagoryService
);

export default router;
