import express from 'express';
import {
  getContactController,
  updateContactController
} from '../controllers/contact-info-controller';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';

const router = express.Router();
router.get('/get-contact', getContactController);
router.put(
  '/update-contact/:id',
  authenticateToken,
  isOwner,
  updateContactController
);
export default router;
