import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (
    req: unknown,
    file: unknown,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, 'public/products');
  },
  filename: function (
    req: unknown,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }
});
