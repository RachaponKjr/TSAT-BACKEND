import type { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import path from 'path';

// ✅ Upload
export const uploadBlogImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const image = req.file as Express.Multer.File;
    console.log(image);
    if (!image) {
      // อย่าลืม return **พร้อม** response เพื่อหยุด
      res.status(400).json({ message: 'กรุณาอัปโหลดรูปภาพ' });
      return;
    }

    res.status(200).json({
      status: 200,
      filename: image.filename,
      url: `http://localhost:3130/uploads/edit-blogs/${image.filename}`
    });
    return;
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Upload failed', error });
      return;
    } else {
      console.error('Headers already sent, error:', error);
    }
  }
};

// ✅ Delete
export const deleteBlogImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    if (!filename || filename.includes('..')) {
      res.status(400).json({ message: 'ชื่อไฟล์ไม่ปลอดภัย' });
    }

    const filePath = path.join(
      process.cwd(),
      'public/uploads/edit-blogs',
      filename
    );
    await unlink(filePath);

    res.status(200).json({ status: 200, message: 'ลบรูปภาพสำเร็จ' });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'ลบไม่สำเร็จ', error });
    } else {
      console.error('Headers already sent, error:', error);
    }
  }
};
