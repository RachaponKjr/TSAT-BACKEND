import { Router } from 'express';
import {
  getReviewController,
  getReviewAllController,
  updateShowReviewController
} from '../controllers/review.controller';
import { authenticateToken, isUser } from '../middlewares/auth-admin';

const route = Router();

route.get('/get-review', getReviewController);
route.get('/get-review-all', getReviewAllController);

route.patch(
  '/update-show-review',
  authenticateToken,
  isUser,
  updateShowReviewController
);

export default route;
