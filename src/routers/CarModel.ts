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
  upload.fields([
    { name: 'image_model', maxCount: 1 },
    { name: 'image_name', maxCount: 1 }
  ]),
  createCarModelController
);
router.get('/', getCarModelController);
router.get('/:id', getCarModelByIdController);
router.put('/:id', updateCarModelController);
router.delete('/:id', deleteCarModelController);

export default router;
