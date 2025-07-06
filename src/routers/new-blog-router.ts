import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createBlogController,
  delBlogController,
  getBlogByCarmodel,
  getBlogByIdController,
  getBlogsController,
  updateBlogController
} from '../controllers/new-blog-controller';
import { authenticateToken, isAdmin, isUser } from '../middlewares/auth-admin';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/blogs/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  '/create-blog',
  authenticateToken,
  isUser,
  upload.array('images'),
  createBlogController
);
router.get('/getall-blogs', getBlogsController);
router.get('/getblog/:id', getBlogByIdController);
router.get('/get-by-carsubmodel/:id', getBlogByCarmodel);
router.put(
  '/update-blog/:id',
  authenticateToken,
  isAdmin,
  upload.array('images'),
  updateBlogController
);
router.delete('/del-blog/:id', authenticateToken, isAdmin, delBlogController);
export default router;
