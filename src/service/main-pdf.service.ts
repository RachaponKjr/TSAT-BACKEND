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

  // ตรวจสอบ OS: ใช้ Chrome ของ Mac Specific เฉพาะตอน Dev บนเครื่อง Mac
  const isMac = process.platform === 'darwin';
  const macChromePath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  // ลำดับการหา Executable Path:
  // 1. จาก ENV PUPPETEER_EXECUTABLE_PATH (ตั้งค่าไว้ใน Dockerfile คือ /usr/bin/chromium-browser)
  // 2. Path Chrome ของ Mac
  // 3. undefined ให้ Puppeteer หาเอง
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (isMac && fs.existsSync(macChromePath) ? macChromePath : undefined);

  // Flags ที่จำเป็นอย่างยิ่งสำหรับ Alpine Linux Container & Docker Environment
  const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process' // 👈 สำคัญมากสำหรับ Node Alpine ป้องกัน Chromium crash
  ];

  const pdfOptions: any = {
    format: 'A4',
    landscape: !!options.landscape,
    printBackground: true,
    args: chromiumArgs,
    waitUntil: 'domcontentloaded', // ไม่ค้างรอภาพ/ฟอนต์ภายนอกจนเกิน Timeout
    launchOptions: {
      args: chromiumArgs,
      ...(executablePath ? { executablePath } : {}),
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
