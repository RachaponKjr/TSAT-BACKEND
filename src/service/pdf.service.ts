/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import htmlPdf from 'html-pdf-node';
import { IService } from '../controllers/pdf.controller';
import { generatePDFQS } from '../template/full-qs';
import { generatePDFQSShort } from '../template/short-qs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pdf');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class PdfService {
  async generateAndSavePdf(
    quotationNumber: string,
    type: 'full' | 'short'
  ): Promise<{ fileUrl: string }> {
    const fileName = `${quotationNumber}_${type}.pdf`;
    const targetFilePath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(targetFilePath)) {
      const roRes = await fetch(
        `https://tsatdata.com/api/checkups/${quotationNumber}`
      );
      const data = (await roRes.json()) as IService;
      return { ...data, fileUrl: `/uploads/pdf/${fileName}` };
    }

    const roRes = await fetch(
      `https://tsatdata.com/api/checkups/${quotationNumber}`
    );
    const data = (await roRes.json()) as IService;

    const htmlContent =
      type === 'full'
        ? generatePDFQS(data.data)
        : generatePDFQSShort(data.data);

    const options =
      type === 'short'
        ? {
            format: 'A4',
            landscape: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage'
            ]
          }
        : {
            format: 'A4',
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage'
            ]
          };

    // แปลง HTML เป็น PDF
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      htmlPdf.generatePdf(
        { content: htmlContent },
        options,
        (err: any, buffer: Buffer) => {
          if (err) return reject(err);
          resolve(buffer);
        }
      );
    });

    fs.writeFileSync(targetFilePath, pdfBuffer as any);

    return {
      fileUrl: `/uploads/pdf/${fileName}`
    };
  }
}
