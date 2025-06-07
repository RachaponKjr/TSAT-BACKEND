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
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';
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
  isUser,
  upload.single('image_model'),
  createCarModelController
);
router.get('/', getCarModelController);
router.get('/:id', getCarModelByIdController);
router.put(
  '/:id',
  authenticateToken,
  isUser,
  upload.single('image_model'),
  updateCarModelController
);
router.delete('/:id', authenticateToken, isAdmin, deleteCarModelController);

export default router;
