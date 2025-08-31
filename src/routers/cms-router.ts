import express from 'express';
import {
  getAboutController,
  getCmsHomeController,
  getCmsProductController,
  getCmsServiceController,
  getContactController,
  getCustumersController,
  updateAboutController,
  updateCmsHomeController,
  updateCmsProductController,
  updateCmsServiceController,
  updateContactController,
  updateCustumersController
} from '../controllers/cms-controller';
import { authenticateToken, isOwner, isUser } from '../middlewares/auth-admin';
import multer from 'multer';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/cms/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get('/get-home', getCmsHomeController);
router.patch(
  '/update-home/:id',
  authenticateToken,
  isUser,
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'bannerImage2', maxCount: 1 }
  ]),
  updateCmsHomeController
);
router.get('/get-service', getCmsServiceController);
router.put(
  '/update-service/:id',
  authenticateToken,
  isUser,
  updateCmsServiceController
);
router.get('/get-product', getCmsProductController);
router.put(
  '/update-product/:id',
  authenticateToken,
  isUser,
  updateCmsProductController
);
router.get('/get-customer', getCustumersController);
router.put(
  '/update-customer/:id',
  authenticateToken,
  isUser,
  updateCustumersController
);
router.get('/get-about', getAboutController);
router.put(
  '/update-about/:id',
  authenticateToken,
  isUser,
  updateAboutController
);
router.get('/get-contact', getContactController);
router.put(
  '/update-contact/:id',
  authenticateToken,
  isUser,
  updateContactController
);
export default router;
