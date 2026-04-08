/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, isUser } from '../middlewares/auth-admin';

const router = express.Router();

// --- การตั้งค่า Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ระบุโฟลเดอร์ที่จะเก็บไฟล์ (ต้องสร้างโฟลเดอร์นี้ไว้ก่อน)
  },
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์ใหม่: วันที่ปัจจุบัน + ชื่อไฟล์เดิม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- Route ---
// 'image' คือชื่อ key ที่ Client ต้องส่งมาใน FormData
router.post(
  '/',
  authenticateToken,
  isUser,
  upload.single('image'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        // ใช้แค่ res.status... ไม่ต้องมี return ข้างหน้า
        res.status(400).json({ message: 'กรุณาเลือกไฟล์ที่ต้องการอัปโหลด' });
        return; // ใส่ return เปล่าๆ เพื่อหยุดการทำงานของฟังก์ชัน
      }

      const filePath = req.file.path;

      res.status(200).json({
        message: 'อัปโหลดสำเร็จ!',
        path: `/${filePath}`
      });
    } catch (error: any) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
  }
);

export default router;
