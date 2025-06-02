import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadBlogImage,
  deleteBlogImage
} from '../controllers/blog-controller';
import { authenticateToken, isOwner } from '../middlewares/auth-admin';

const router = express.Router();

// Set destination and filename rules
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/edit-blogs/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. .png, .jpg
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Limit file size to 5MB
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// POST /upload-blog-image
router.post(
  '/upload-blog-image',
  authenticateToken,
  isOwner,
  upload.single('image'),
  uploadBlogImage
);

router.put(
  '/edit-blog',
  authenticateToken,
  isOwner,
  upload.single('image'),
  () => {
    console.log('ok');
  }
);

// DELETE /delete-blog-image/:filename
router.delete('/delete-blog-image/:filename', deleteBlogImage);

export default router;
