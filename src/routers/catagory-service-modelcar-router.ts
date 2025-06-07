import express from 'express';
import {
  categoryServiceModelCar,
  createCatagoryService
} from '../controllers/catagory-service-modelcar-controller';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
const router = express.Router();

router.post('/create', authenticateToken, isUser, categoryServiceModelCar);
router.post(
  '/create-service',
  authenticateToken,
  isUser,
  createCatagoryService
);

export default router;
