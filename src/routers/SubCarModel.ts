import express from 'express';
import {
  createSubCarModelController,
  deleteSubCarModelController,
  getSubCarModelByIdController,
  getSubCarModelController
} from '../controllers/SubCarmodelController';
import multer from 'multer';
import path from 'path';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/subcarmodel/',
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
  upload.single('image'),
  createSubCarModelController
);
router.get('/get', getSubCarModelController);
router.get('/get/:id', getSubCarModelByIdController);
router.delete(
  '/delete/:id',
  authenticateToken,
  isOwner,
  deleteSubCarModelController
);

export default router;
