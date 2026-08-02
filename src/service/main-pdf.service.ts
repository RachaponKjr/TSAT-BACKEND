// services/main-pdf.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
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

  // ⚠️ เดิมใช้ html-pdf-node ซึ่ง bundle puppeteer เวอร์ชันเก่าของตัวเอง (v10) แยกจาก
  // top-level puppeteer (v24) ที่เราติดตั้งไว้ และมันไม่รับ waitUntil/launchOptions/timeout
  // ที่เราส่งไปเลย (hardcode 'networkidle0' + timeout 30s เสมอ) ทำให้เวลา resource ภายนอก
  // ในเทมเพลต (เช่นรูปรถ) โหลดช้า/โหลดไม่ได้ มันจะ throw TimeoutError ก่อนที่ callback จะถูกเรียก
  // -> กลายเป็น unhandled rejection ที่ทำให้ process ทั้งตัวล่ม จึงเปลี่ยนมาคุม puppeteer เอง
  // เพื่อดัก timeout ได้จริง และปิด browser ได้แน่นอนทุก path (สำเร็จ/พัง)
  const browser = await puppeteer.launch({
    args: chromiumArgs,
    headless: true,
    pipe: isMac,
    ...(executablePath ? { executablePath } : {}),
    timeout: 60000
  });

  try {
    const page = await browser.newPage();

    try {
      // รอโหลดจน network idle เพื่อให้รูป/ฟอนต์ภายนอกทันโหลดครบ แต่จำกัดเวลาไว้ไม่ให้ค้าง
      // ตลอดไปถ้ามี resource ที่โหลดไม่สำเร็จ (unreachable/ช้า)
      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'TimeoutError';
      if (!isTimeout) {
        throw err;
      }
      // resource บางอย่างโหลดไม่ทันใน 20s (เช่น รูปภาพภายนอก) -> ไปต่อด้วยเนื้อหาที่โหลดได้
      // ตอนนี้ แทนที่จะปล่อยให้ทั้ง request ค้าง/ล้มทั้งกระบวนการ
    }

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: !!options.landscape,
      printBackground: true
    });

    fs.writeFileSync(targetFilePath, pdfBuffer);
  } finally {
    await browser.close();
  }

  return { fileUrl: `/uploads/pdf/${fileName}` };
}
