import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getWorkServiceController,
  WorkServiceController
} from '../controllers/work-service-controlle';
import { authenticateToken, isOwner, isUser } from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  '/create-service',
  authenticateToken,
  isUser,
  upload.single('image'),
  WorkServiceController
);
router.get('/get-services', getWorkServiceController);

export default router;
