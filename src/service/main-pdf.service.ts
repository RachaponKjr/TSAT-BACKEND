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
  fileName?: string; // ถ้าอยากตั้งชื่อเองยังใส่ได้ ไม่บังคับ
}

export async function generatePdfFromTemplate(
  templateFn: TemplateFn,
  data: any,
  options: GeneratePdfOptions = {}
): Promise<{ fileUrl: string }> {
  // gen ชื่อไม่ซ้ำทุกครั้ง: timestamp + random hex
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
      timeout: 120000
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
