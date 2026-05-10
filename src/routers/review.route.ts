import { Router } from 'express';
import {
  getReviewController,
  getReviewAllController
} from '../controllers/review.controller';

const route = Router();

route.get('/get-review', getReviewController);
route.get('/get-review-all', getReviewAllController);

export default route;
