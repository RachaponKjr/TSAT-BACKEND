// services/pdf.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import htmlPdf from 'html-pdf-node';

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pdf');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

type TemplateFn = (data: any) => string;

interface GeneratePdfOptions {
  landscape?: boolean;
  fileName?: string;
}

export async function generatePdfFromTemplate(
  templateFn: TemplateFn,
  data: any,
  options: GeneratePdfOptions = {}
): Promise<{ fileUrl: string }> {
  const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fileName = options.fileName ?? `${uniqueId}.pdf`;
  const targetFilePath = path.join(UPLOAD_DIR, fileName);

  const htmlContent = templateFn(data);

  // 1. ตรวจสอบว่าระบบรันอยู่บน macOS หรือ Linux/Docker
  const isMac = process.platform === 'darwin';
  const macChromePath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  // 2. ตั้งค่า Launch Options สำหรับ Puppeteer
  const launchOptions: any = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote'
    ],
    timeout: 60000
  };

  // ถ้าเป็น Mac เครื่อง Local ให้ใช้ path ของ Chrome Mac
  // ถ้าเป็น Docker/Linux ให้เว้นไว้เพื่อให้ Puppeteer ใช้ Chromium ตัวที่ติดกับ node_modules แทน
  if (isMac && fs.existsSync(macChromePath)) {
    launchOptions.executablePath = macChromePath;
  }

  // 3. กำหนด pdfOptions และwaitUntil เพื่อป้องกัน Network Timeout
  const pdfOptions: any = {
    format: 'A4',
    landscape: !!options.landscape,
    printBackground: true,
    // 🔧 เปลี่ยน waitUntil เป็น 'domcontentloaded' ไม่ต้องค้างรอรูปหรือลิงก์ภายนอกที่อาจโหลดไม่ขึ้น
    waitUntil: 'domcontentloaded',
    timeout: 60000,
    launchOptions: launchOptions
  };

  try {
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
  } catch (error) {
    console.error('Error in generatePdfFromTemplate:', error);
    throw new Error(
      'PDF generation failed due to rendering or network timeout.'
    );
  }
}
