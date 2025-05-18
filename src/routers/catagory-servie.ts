import express from 'express';
import { getCatagory, postCatagory } from '../controllers/catagory-service';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.post('/create', authenticateToken, isOwner, postCatagory);
router.get('/get', getCatagory);

export default router;
