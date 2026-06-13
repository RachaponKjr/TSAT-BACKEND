import { Router } from 'express';
import { PdfController } from '../controllers/pdf.controller';

const router = Router();
const pdfController = new PdfController();

// สร้าง PDF (ส่งมาแค่ title กับ content) -> ได้ pdfId กลับไป
router.post('/create', pdfController.createPdf);

// เปิดดู PDF เมื่อไหร่ก็ได้ผ่าน ID
// router.get('/view/:id', pdfController.viewPdf);

export default router;
