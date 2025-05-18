import express from 'express';
import {
  createCarModelController,
  deleteCarModelController,
  getCarModelByIdController,
  getCarModelController,
  updateCarModelController
} from '../controllers/CarModelController';
import multer from 'multer';
import path from 'path';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/carmodel/',
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
  isOwner,
  upload.fields([
    { name: 'image_model', maxCount: 1 },
    { name: 'image_name', maxCount: 1 }
  ]),
  createCarModelController
);
router.get('/', getCarModelController);
router.get('/:id', getCarModelByIdController);
router.put('/:id', authenticateToken, isOwner, updateCarModelController);
router.delete('/:id', authenticateToken, isOwner, deleteCarModelController);

export default router;
