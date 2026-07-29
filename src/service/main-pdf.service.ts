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

  // 1. ตรวจสอบสภาพแวดล้อม
  const isMac = process.platform === 'darwin';

  const macChromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'
  ];

  // Path ของ Chromium บน Linux (กรณีไม่ได้ตั้ง PUPPETEER_EXECUTABLE_PATH)
  const linuxChromePaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];

  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  if (!executablePath) {
    if (isMac) {
      executablePath = macChromePaths.find((p) => fs.existsSync(p));
    } else {
      executablePath = linuxChromePaths.find((p) => fs.existsSync(p));
    }
  }

  // 2. Flags ปลอดภัยสำหรับทั้ง Linux และ Mac
  // ⚠️ ตัด '--single-process' และ '--no-zygote' ออก เพราะทำให้ Linux Crash
  const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--disable-extensions'
  ];

  const file = { content: htmlContent };

  // 3. กำหนด launchOptions ตาม OS
  const pdfOptions: any = {
    format: 'A4',
    landscape: !!options.landscape,
    printBackground: true,
    args: chromiumArgs,
    waitUntil: 'domcontentloaded',
    launchOptions: {
      args: chromiumArgs,
      headless: true,
      // 🟢 บน Mac ใช้ pipe: true ได้ แต่บน Linux ให้ปิดเป็น false
      pipe: isMac,
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
