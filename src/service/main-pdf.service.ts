// services/pdf.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import crypto from 'crypto';
import htmlPdf from 'html-pdf-node';
import fs from 'fs';

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

  // 1. ตรวจสอบสภาพแวดล้อม (Mac OS vs Docker Linux)
  const isMac = process.platform === 'darwin';

  // เช็ค Path ของ Google Chrome บน Mac (ทั้ง Intel และ Apple Silicon M1/M2/M3)
  const macChromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'
  ];

  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  if (!executablePath && isMac) {
    executablePath = macChromePaths.find((p) => fs.existsSync(p));
  }

  // 2. Flags บังคับรันแบบประหยัด Resource
  const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-extensions'
  ];

  const file = {
    content: htmlContent
  };

  // 3. กำหนด launchOptions ที่แก้ไขปัญหาการ Launch ค้างบน Mac
  const pdfOptions: any = {
    format: 'A4',
    landscape: !!options.landscape,
    printBackground: true,
    args: chromiumArgs,
    waitUntil: 'domcontentloaded',
    launchOptions: {
      args: chromiumArgs,
      headless: true,
      pipe: true, // 🔴 บังคับใช้ Pipe แทน WebSocket ป้องกัน Connection Timeout บน macOS
      ...(executablePath ? { executablePath } : {}),
      timeout: 60000
    }
  };

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    htmlPdf.generatePdf(file, pdfOptions, (err: any, buffer: Buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });

  fs.writeFileSync(targetFilePath, pdfBuffer as any);

  return { fileUrl: `/uploads/pdf/${fileName}` };
}
