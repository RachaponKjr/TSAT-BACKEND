// services/pdf.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import htmlPdf from 'html-pdf-node';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads/pdf');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

type TemplateFn = (data: any) => string;

interface GeneratePdfOptions {
  landscape?: boolean;
  fileName?: string; // ถ้าอยากตั้งชื่อเองยังใส่ได้ ไม่บังคับ
}

/**
 * ฟังก์ชันกลาง: รับ template function + ข้อมูล -> generate PDF -> เซฟไฟล์ -> return url
 * เรียกซ้ำได้เรื่อยๆ ไม่ว่าจะ template ไหน ชื่อไฟล์ไม่ซ้ำกันแน่นอน
 */
export async function generatePdfFromTemplate(
  templateFn: TemplateFn,
  data: any,
  options: GeneratePdfOptions = {}
): Promise<{ fileUrl: string }> {
  const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fileName = options.fileName ?? `${uniqueId}.pdf`;
  const targetFilePath = path.join(UPLOAD_DIR, fileName);

  const htmlContent = templateFn(data);

  const pdfOptions = {
    format: 'A4',
    landscape: !!options.landscape,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    launchOptions: {
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      timeout: 60000
    }
  };

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    htmlPdf.generatePdf(
      { content: htmlContent },
      pdfOptions,
      (err: any, buffer: Buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      }
    );
  });

  fs.writeFileSync(targetFilePath, pdfBuffer as any);

  return { fileUrl: `/uploads/pdf/${fileName}` };
}

/**
 * ลบไฟล์ PDF ออกจาก uploads/pdf
 * รับได้ทั้ง fileUrl ("/uploads/pdf/xxx.pdf") หรือแค่ fileName ("xxx.pdf")
 * เรียกซ้ำได้เรื่อยๆ ไม่ error แม้ไฟล์ไม่มีอยู่แล้ว (idempotent)
 */
export function deletePdfFile(fileUrlOrName: string): { deleted: boolean } {
  if (!fileUrlOrName || typeof fileUrlOrName !== 'string') {
    throw new Error('fileUrlOrName is required');
  }

  // ตัดให้เหลือแค่ชื่อไฟล์ ไม่ว่าจะส่ง "/uploads/pdf/xxx.pdf" หรือ "xxx.pdf" มา
  const fileName = path.basename(fileUrlOrName);

  if (!fileName || fileName === '.' || fileName === '..') {
    throw new Error('Invalid file name');
  }

  const targetFilePath = path.join(UPLOAD_DIR, fileName);

  // กัน path traversal (เช่น ../../etc/passwd) ไม่ให้หลุดออกนอก UPLOAD_DIR
  if (!targetFilePath.startsWith(UPLOAD_DIR)) {
    throw new Error('Invalid file path');
  }

  if (!fs.existsSync(targetFilePath)) {
    return { deleted: false };
  }

  // กันเผื่อ path ที่คำนวณได้ดันไปตรงกับโฟลเดอร์ ไม่ใช่ไฟล์
  const stat = fs.statSync(targetFilePath);
  if (!stat.isFile()) {
    throw new Error('Target path is not a file');
  }

  fs.unlinkSync(targetFilePath);
  return { deleted: true };
}
