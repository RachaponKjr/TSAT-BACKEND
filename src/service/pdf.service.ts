/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import htmlPdf from 'html-pdf-node';
import { IService } from '../controllers/pdf.controller';
import { generatePDFQS } from '../template/full-qs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pdf');

// ถ้ายังไม่มีโฟลเดอร์ให้สร้างขึ้นมา
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class PdfService {
  // 1. สร้างไฟล์ PDF และเซฟลง Server
  async generateAndSavePdf(
    quotationNumber: string
  ): Promise<IService & { fileUrl: string }> {
    // ✅ เช็คไฟล์ก่อน ถ้ามีอยู่แล้วไม่ต้อง generate ใหม่
    const existingFile = path.join(UPLOAD_DIR, `${quotationNumber}.pdf`);
    if (fs.existsSync(existingFile)) {
      const roRes = await fetch(
        `https://tsatdata.com/api/checkups/${quotationNumber}`
      );
      const data = (await roRes.json()) as IService;
      return {
        ...data,
        fileUrl: `/uploads/pdf/${quotationNumber}.pdf`
      };
    }

    const roRes = await fetch(
      `https://tsatdata.com/api/checkups/${quotationNumber}`
    );
    const data = (await roRes.json()) as IService;
    const fileName = `${data.data.quotation_no}.pdf`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const htmlContent = generatePDFQS(data.data);

    // แปลง HTML เป็น PDF
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      htmlPdf.generatePdf(
        { content: htmlContent },
        {
          format: 'A4',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ]
        },
        (err: any, buffer: Buffer) => {
          if (err) return reject(err);
          resolve(buffer);
        }
      );
    });

    fs.writeFileSync(filePath, pdfBuffer as any);
    return {
      ...data,
      fileUrl: `/uploads/pdf/${fileName}`
    };
  }
}
