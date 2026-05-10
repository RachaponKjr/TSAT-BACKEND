import { Router } from 'express';
import {
  getReviewController,
  getReviewAllController,
  updateShowReviewController,
  getReviewAllActiveController
} from '../controllers/review.controller';
import { authenticateToken, isUser } from '../middlewares/auth-admin';

const route = Router();

route.get('/get-review', getReviewController);
route.get('/get-review-all-active', getReviewAllActiveController);
route.get('/get-review-all', authenticateToken, isUser, getReviewAllController);

route.patch(
  '/update-show-review',
  authenticateToken,
  isUser,
  updateShowReviewController
);

export default route;
