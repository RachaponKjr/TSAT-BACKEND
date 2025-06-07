import express from 'express';
import {
  getContactController,
  updateContactController
} from '../controllers/contact-info-controller';
import { authenticateToken, isOwner, isUser } from '../middlewares/auth-admin';

const router = express.Router();
router.get('/get-contact', getContactController);
router.put(
  '/update-contact/:id',
  authenticateToken,
  isUser,
  updateContactController
);
export default router;
