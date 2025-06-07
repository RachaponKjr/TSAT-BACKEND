import express from 'express';
import { getCatagory, postCatagory } from '../controllers/catagory-service';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
const router = express.Router();

router.post('/create', authenticateToken, isUser, postCatagory);
router.get('/get', getCatagory);

export default router;
