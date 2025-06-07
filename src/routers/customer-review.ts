import express from 'express';
import {
  CustomerReviewController,
  deleteReviewController,
  getReviewByIdController,
  getReviewController
} from '../controllers/customer-review';
import multer from 'multer';
import path from 'path';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/reviews/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  '/create',
  authenticateToken,
  isUser,
  upload.single('image'),
  CustomerReviewController
);
router.get('/get', getReviewController);
router.get('/get/:id', getReviewByIdController);
router.delete(
  '/delete/:id',
  authenticateToken,
  isAdmin,
  deleteReviewController
);
export default router;
