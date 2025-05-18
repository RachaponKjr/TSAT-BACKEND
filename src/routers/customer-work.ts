import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createWorkController,
  deleteWorkController,
  getBySubCarModelController,
  getWithCarModelController,
  getWorkController,
  getWorksController
} from '../controllers/customer-work';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/works/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  '/create-work',
  authenticateToken,
  isOwner,
  upload.single('image'),
  createWorkController
);
router.get('/get-works', getWorksController);
router.get('/get-with-carModel/:id', getWithCarModelController);
router.get('/get-by-subCarModel/:id', getBySubCarModelController);
router.get('/get-work/:id', getWorkController);
router.delete(
  '/delete-work/:id',
  authenticateToken,
  isOwner,
  deleteWorkController
);
export default router;
