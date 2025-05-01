import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createWorkController,
  getWorkController,
  getWorksController
} from '../controllers/customer-work';
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

router.post('/create-work', upload.single('image'), createWorkController);
router.get('/get-works', getWorksController);
router.get('/get-work/:id', getWorkController);
router.delete('/delete-work/:id', getWorkController);
export default router;
