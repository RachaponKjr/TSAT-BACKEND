/* eslint-disable no-console */
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra'; // 👈 นำเข้าจากตัว dayjs โดยตรง
import 'dayjs/locale/th';
import { ReqOpenQuotationReport, ReqReferences } from '../types/quotation.type';
import fs from 'fs';
import path from 'path';

dayjs.extend(buddhistEra); // ✅ เปิดใช้งาน Plugin
dayjs.locale('th');

export interface IQuotation extends ReqOpenQuotationReport {
  id: string;
  createdAt: Date;
  references: ReqReferences[];
  report: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    carModel: string;
    pdfUrl: string | null;
    pdfExpireDate: Date | null;
    templateId: string;
    imageCar: string | null;
    customerName: string;
    modelYear: string;
    vin: string;
    odometer: number;
    licensePlate: string;
    inspectorName: string | null;
    inspectedAt: Date | null;
    approverName: string | null;
    approvedAt: Date | null;
    overallGrade: string | null;
    totalScore: number | null;
    maxScore: number | null;
    performancePdfUrl: string | null;
  };
  items: {
    item_name: string;
    quantity: number;
    total_price: number;
  }[];
}

const safeImgSrc = (value?: string | null): string => {
  if (!value || value.trim() === '') {
    return PLACEHOLDER_IMG_BASE64;
  }
  return value;
};

const PLACEHOLDER_IMG_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

const convertLocalFileToBase64 = (relativePath: string): string => {
  // รูป 1x1 Transparent GIF สำหรับ fallback เพื่อไม่ให้ Chromium ค้างรอ Network
  const EMPTY_GIF =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  if (!relativePath) return EMPTY_GIF;

  try {
    // 1. ดึงเฉพาะชื่อไฟล์ท้ายสุด เช่น "1784863583696-22454088.jpg"
    const fileName = path.basename(relativePath.split('?')[0]);

    // 2. ชี้ Path ไปยังโฟลเดอร์ uploads ที่ไฟล์อยู่จริง
    const possiblePaths = [
      path.join(process.cwd(), 'uploads', fileName),
      path.join('/app/uploads', fileName),
      path.join(__dirname, '../../uploads', fileName)
    ];

    let absolutePath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        absolutePath = p;
        break;
      }
    }

    // 3. ถ้าหาไฟล์ไม่เจอ ไม่ต้องพ่น console.warn ให้ส่ง GIF ใสกลับไปเงียบๆ
    if (!absolutePath) {
      return EMPTY_GIF;
    }

    // 4. อ่านไฟล์และแปลงเป็น Base64
    const fileBuffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
    const mimeType =
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext || 'png'}`;

    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  } catch (_err) {
    // 5. หากเกิดข้อผิดพลาดใดๆ ให้ข้าม error ไปเงียบๆ และคืนค่ารูปใสเช่นกัน
    return EMPTY_GIF;
  }
};

function formatNumber(number, decimals = 2) {
  if (isNaN(number)) return '0';

  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
}

export const calculateSingleAveragePrice = ({
  priceHight,
  priceLow
}: {
  priceHight: number;
  priceLow: number;
}): number => {
  const high = priceHight ?? 0;
  const low = priceLow ?? 0;

  // มีทั้งราคา สูง และ ต่ำ
  if (priceHight != null && priceLow != null) {
    return Math.round((high + low) / 2);
  }

  // ถ้ามีแค่อย่างใดอย่างหนึ่ง ให้ใช้ค่านั้นได้เลย
  if (priceHight != null) return high;
  if (priceLow != null) return low;

  return 0;
};

// 2. ฟังก์ชัน HTML Template ที่รับ Object ทั้งก้อนไปใช้งาน
export function generateQuotationPaper(data: IQuotation): string {
  const totalPrice = data.items.reduce(
    (total, item) => total + item.total_price,
    0
  );

  const vat = totalPrice * 0.07;

  const totalWithVat = totalPrice + vat;

  function getGradeColor(grade: string): string {
    const map: Record<string, string> = {
      A: '#28a745',
      B: '#fd7e14',
      C: '#C21A20',
      D: '#666666'
    };
    return map[grade] ?? '#333333';
  }

  function getGradeLabel(grade: string): string {
    const map: Record<string, string> = {
      A: 'สภาพดีเยี่ยม',
      B: 'สภาพดี',
      C: 'สภาพปานกลาง',
      D: 'ควรซ่อมแซม'
    };
    return map[grade] ?? '';
  }

  const hasItems = data && data.items && data.items.length > 0;
  // const tailwindCssPath = path.join(
  //   process.cwd(),
  //   'src/assets/tailwind.min.css'
  // );
  // const tailwindCss = fs.readFileSync(tailwindCssPath, 'utf8');

  return `
  <!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ใบเสนอราคา / รายการประเมินมูลค่ารถ</title>
<style>
    @page {
      size: A4 landscape;
    }
    * {
      font-family: 'IBM Plex Sans Thai', sans-serif !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

  body {
    font-family: 'Noto Sans Thai', sans-serif;
  }

  .header {
      background-color: #F5F5F5;
      padding: 10px 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #CCCCCC;
    }

    .header img {
      width: 180px;
      height: auto;
      display: block;
    }
    .company-info {
      text-align: right;
      color: #333333;
    }

    .company-info h6 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
    }

    .company-info p,
    .company-info span {
      margin: 0;
      font-size: 12px;
      line-height: 1.3;
      display: block;
    }
  /* เทียบเท่ากับ Tailwind v4 arbitrary "basis-md!" ที่ใช้ในโค้ดต้นฉบับ */
  .product-side-basis {
    flex-basis: 28rem; /* basis-md */
  }
  @media (min-width: 1536px) {
    .product-side-basis {
      flex-basis: 36rem; /* 2xl:basis-xl */
    }
  }
</style>
</head>
<body style="background-color: #ffffff;">

  <!-- SidePage -->
  <div style="display: flex; flex-direction: column; flex: 1; height: 100vh; background-color: #ffffff; gap: 0;">
<div class="header" style="position:sticky;top:0">
    <img src="data:image/webp;base64,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" alt="" width="462" height="104" />
      <div class="company-info">
        <h6>บริษัท ท็อป เซอร์วิส ออโต้ เทคนิค จำกัด (Top Service Auto Technic Co., Ltd.)</h6>
        <p>เลขที่ 236 ซอยลาดพร้าว 26 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร โทร. 02-0444955</p>
        <span>เลขที่ผู้เสียภาษี 010 556 018 543 3</span>
      </div>
    </div>
    <!-- ============================= -->
    <!-- CreateSide (ฝั่งซ้าย)          -->
    <!-- ============================= -->
    <div style="flex: 1; display: flex; flex-direction: column; padding: 8px 16px; max-width: 80%; width:100%; margin: auto;">

      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4px;">
        <span style="font-size: 16px; color: #666666; font-weight: 600; white-space: nowrap; flex-shrink: 0;">
          ใบเสนอราคา / รายการประเมินมูลค่ารถ
        </span>
        
        <div style="display: flex; flex-direction: row; gap: 24px; align-items: flex-end;">
          <!-- เลขที่ -->
          <div style="display: flex; flex-direction: column; text-align: right;">
            <label style="font-size: 10px; color: #666666;">เลขที่</label>
            <span style="font-size: 13px; font-weight: 600; color: #333333; white-space: nowrap;">${
              data?.quotationId || '-'
            }</span>
          </div>
          <!-- วันที่ -->
          <div style="display: flex; flex-direction: column; text-align: right;">
            <label style="font-size: 10px; color: #666666;">วันที่</label>
            <span style="font-size: 13px; font-weight: 600; color: #333333; white-space: nowrap;">${
              data?.createdAt
                ? dayjs(data.createdAt).format('D MMMM BBBB')
                : '-'
            }</span>
          </div>
          <!-- วันที่หมดอายุ -->
          <div style="display: flex; flex-direction: column; text-align: right;">
            <label style="font-size: 10px; color: #666666;">วันที่หมดอายุ</label>
            <span style="font-size: 13px; font-weight: 600; color: #333333; white-space: nowrap;">${
              data?.invoiceExpireDate
                ? dayjs(data.invoiceExpireDate).format('D MMMM BBBB')
                : '-'
            }</span>
          </div>
        </div>
      </div>

      <div style="flex: 1;">
        <div style="display: flex; flex-direction: row; gap: 16px;">

          <!-- Left Card: Car Info & Evaluation -->
          <div style="display: flex; flex-direction: column; flex: 1; border-radius: 8px; border: 1px solid #DDDDDD;">

            <!-- Section 1: ข้อมูลรถยนต์ -->
            <div style="padding: 12px; display: flex; flex-direction: column; gap: 0;">
              <span style="color: #666666; font-weight: 700; font-size: 16px;">ข้อมูลรถยนต์</span>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">ลูกค้า</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${
                    data.report.customerName
                  }</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">รุ่นรถ</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${
                    data.report.carModel
                  }</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">รหัสตัวถัง (VIN)</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${
                    data.report.vin
                  }</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">ทะเบียน</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${
                    data.report.licensePlate
                  }</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">ปีรถ</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${
                    data.report.modelYear
                  }</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <label style="color: #666666; font-size: 14px;">เลขกิโลเมตร</label>
                  <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">${formatNumber(
                    data.report.odometer,
                    0
                  )}</div>
                </div>
              </div>
            </div>

            <!-- Section 2: ผลการประเมิน -->
            <div style="padding: 0px 8px; display: flex; flex-direction: column; gap: 0;">
              <span style="color: #333333; font-weight: 700; font-size: 18px;">ผลการประเมิน</span>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
                <!-- Grade Left Side -->
                <div style="display: flex; flex: 1; align-items: baseline; gap: 12px;">
                  <span
                  style="line-height: 1; font-weight: 700; color: ${getGradeColor(
                    data.report.overallGrade ?? 'A'
                  )}; font-size: 54px"
                  >${data.report.overallGrade}</span>
                  <span style="font-size: 18px; font-weight: 700; color: ${getGradeColor(
                    data.report.overallGrade ?? 'A'
                  )};">${getGradeLabel(data.report.overallGrade ?? 'A')}</span>
                </div>
                <!-- Score Right Side -->
                <div style="display: flex; flex: 1; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px;">
                  <span style="font-size: 14px; color: #666666;">คะแนนรวม</span>
                  <div style="display: flex; align-items: baseline; gap: 8px;">
                    <span style="font-size: 30px; line-height: 1; font-weight: 700; color: ${getGradeColor(
                      data.report.overallGrade ?? 'A'
                    )}">${data.report.totalScore ?? 0}</span>
                    <span style="font-size: 24px; font-weight: 600; color: #888888;">/ ${
                      data.report.maxScore ?? 0
                    }</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="height: 1px; width: 100%; background-color: #DDDDDD;"></div>

            <!-- Section 3: ผู้ตรวจเช็ค / ผู้อนุมัติ -->
            <div style="padding: 8px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                <label style="color: #666666; font-size: 14px;">ผู้ตรวจเช็ค</label>
                <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">
                  ${
                    data.report.inspectorName
                  } <span style="font-weight: 400; color: #555555;">(${dayjs(
                    data.report.inspectedAt
                  ).format('DD/MM/BBBB')})</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                <label style="color: #666666; font-size: 14px;">ผู้อนุมัติ</label>
                <div style="color: #333333; font-weight: 600; text-align: right; font-size: 14px;">
                  ${
                    data.report.approverName
                  } <span style="font-weight: 400; color: #555555;">(
                    ${dayjs(data.report.approvedAt).format('DD/MM/BBBB')}
                  )</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Card: Empty Space for other info -->
          <div style="border: 1px solid #DDDDDD; flex: 1; border-radius: 8px; background-color: #ffffff; display: flex; flex-direction: column; gap: 0;">
            <img
              style=" width: 100%; height: 250px; object-fit: cover; position: relative;"
              src="${convertLocalFileToBase64(data?.report?.imageCar || '')}"
              alt=""
            />
            <div style="color: #333333; display: flex; flex-direction: column; gap: 2px; justify-content: space-between; height: max-content; padding: 12px 16px;">
              <div style="display: flex; flex-direction: row; gap: 8px; align-items: center; justify-content: space-between;">
                <span style="color: #C21A20; font-weight: 600;">เสนอราคา</span>
                <img src="data:image/webp;base64,UklGRvwfAABXRUJQVlA4WAoAAAAwAAAAzQEAZwAASUNDUEgMAAAAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t//9BTFBIXAUAAAHwVtt2VlvbtnUJkRAJcXAMCUiIgxMHZyTg4IwEJAwJkYCE/Dy/+48JYwATjp3jOyImAL9LH8WegCDGBAQxB4eYE8QZopgDkoghiQRxAkGsQBCnL0ncSxINIjGIEwhitYkzBHECQaxAEDEEESSJhiQR4gyAWIOBT39QaFdMNFcI7ZMlNJoVdEqhuadCloNEqtCJ2GltQeh0hU7dUxYDWYROxE5rCxY6RehE6rQ2CGkQEsqej5QFdAoarT2+ndqYPKtl5p24ho097CkpvoX2fFUhme+x0J5vtNI+nUEuV2Ta69t1h3i6pdxLkcmyI2SFTx3lokiS2z3UUW6kjnIONZxXHPo2+4WKfbLgMOzheCFtDXZSYC5UHFcqsJHxYyMj9oXEvnLBcdsRnF/JRs6nYFdI7CsrjpttnxTsCgm7csHxdhpbOtonBbuFDcfLzwE5wp6528xrAJ1SaFdAyAogkwtOKYZFs9DpiKSGzh7uUQx6lR3KYlg0C51QaibZp/PUkHX5WaOncb5qBaCkIHT2cBWAa5QsspLlLQCcgtRJlhuYD/7x96f+jtkSu229agIgpKKQBVcliZcID3t8iSTxHMRGsobLoiTXT/jXf575gsklxgRzFGOjgpzFGgqbHK7c8FnJuXMLlymLkLNYbXrE+ixidiiLkHI8HyFUkq1dVagn/I/PfIGWw2UPJ0uxbju1WGOh4jCT6SPyMwNALJ+VLLtQbuW479RiNWVaI5StHJ+0leN+VTFD2coxd3AsBmDmZ0HZJWv5jIW9HG/v12i/otBeQaeYAjl/YCG54VPoxEr7h920sQd8CrlCaT9hpf0iO5T2+TxI36FTCu2vV2093CZfAuW6EzopJ2VHumAmC/ZXUspV2SE3Ko54AVI7JTnyO2VdDsKixjUhqZ6V1VwAdaasiyHrHmat2E3qBIpaJyR1WlZdw0FULWFRc95Lqgcoap3gV017SZ1AUeuEpGpIqlh0OUComqHOhEmtBe80wv+qVtan9oW86LMud8pqzRcs+tDLyxQ+tSdUPq7eKHaa03nKh9YfEel8s0b7FsZP5hPfaKF3HT6xv9pEfx49yjeL/YSexo7w1ZRntjB01lcrPLcOHb6Z8Oxp4MibhX5aj+NmfjPl+W3clBebeeXyy0vitdMvLWG7qIcfkyi3nG1N7nlWXyZ5ynTdyqvVleSW1Vbllullbio2xc0dK95zprfn7mHx3LTYCm79Y5LfI9E9Ibsov5yE5loAVFcPw2d9jUpvA4DQPFyHD+f4DpneHj+Quofz8HlAncMNUndN2M8upuFH9vm6Ru+C4+rawvgj61ULvQpjaB6uvwSwXjPR24MFsXs4j5bpkViuiN0lsE+ungZLfKYeL2j0FngXD1sYK2iPxHpeoVfhbx7WwZKfqZ8m9PZwQuwe5rEStkfidFLornv2OFQwPVM5SfmdbaygPpKeU/ity1hBfYvE753GCqbtFcL2RT2OFSCv2/Ot/GYdLU84tatmfncZbpgvSvx2GW5yTdi+rofRNl1T+f062uolmU84D5Eoj7n0K1J/BKYRUvjQjtD4jFv4hWChdy13XT1cfxmY6G0Bdw3Nw3nYrZbYPT3hvql7ehp1xdLozbhz9rCFQSeGhd6Ke1cP65jrOBZ6W7hZaB7mIVeOQvf0hLun7ulpwPVwpPRm3D972AZcxmGht+IbFw+X4VZxKPS28BVoHk6DreAwbJ6e8J2xe3ocaSo4XunN+NbJw/aDk9S83C3rs64lwSjqXfC9Rb3TaVnN+WfbEP5TZmWYx5cY5/Kbqn/++3nH3i/EB3/76Zfe4PjlV/5ciP5SnPb+mBlWUDggKg4AANBGAJ0BKs4BaAAAAAAlibuFwbgD+ADSoU1+H/ixwzOO/y78Pf2o/uvOm7DdoP2e3BEzHqt6BfJfxx/rX/m+wf9V/gH4b9gB+iP9F/IX/C9YB6gP0m/qP+j96D+YfwD0APYA/rv8M+f/7cf5R1gH8E/kvof/3P+w/f/+HH64/8v/nfA3+kH32/0P6APQA9QD+Aerf0r/kX4KfrX46/x/8kf157AbtD6pfs//VeWVuO8hX0g+bfjJ+2v+A5weAF+Efwj+Yfjf+2H9t4woAH4R/Jf6v+Rv99/2//M2wD+G/yX+x/kX++HSWdifoB/APkA/iP8i/uX9p/br/TfBv+vfjp/gPZ3+Nf2H++/jT9AP8K/iP83/rX+A/v39W/8/+u+2DqDv0g/nX1/nogG0Tm640sIlEJs/A2i1Pk9O2p31YFhRJKuBOWTQbpb2Zp8Pebd4zoIxdwPz/9vurm6BTa5WaO6Ilhhd+fEo5xWsx8Ftoxp4yy2wVbVBzATxXtGyOX7MDoISGcftZKNXlhlZ3tBwcyG5QAmZLYK1zHWFVtwLNp5OItVqz5k1EU6/w/kFLhd9LwTYf7z/1K/kt2MZzqlYuz7kIDDKbCh5zxWjbrQPnik9WhrTfSrRD0OEogRqJUNlpMs7y0L1JFPagPUGoWdjFYcNG/WfJq6flAEW9fTcs3QT1C3Yece2tvcR/z1Q1F16Re2AZDElbcNM3CpFCngtufPtQ+kQDhSIhI/YQBG4lnYySBdizcSzsZJAuxZuKA8AAP751A4CbLVriPlEkN63Ex3e/vi2P2Te/ltLkVl8FVSjynTuGTff8lxBG7BQm40wheyQ6lWRRJa57ZiTx4S7TRFkxyYRtcCZh0Glv8cHgHVUohkpGoLsbwowPyHrcrFYI8Ngza+JKHCO4SXlQMQJsaF/SqXrbRiRZ0MK9aSmgGaVQgcWuvf5DFeNNxK7Mzw0zI3G/brVn4oq2GLqiKfKf+2G8/ZLx91Rq6mnJPZ3plIKzA1XilouUubMJG13wG9BjCf4Bhj0bpBpnKMb2skkpIWfRaP3vmXbaZxn5aYYS0gkrt7dZ/54hAy8FO6tTRLSCTOmxOQjgB4Up/NHypuWEWwSn7LguxMrPUmLpqbM74LaCuSyHNfoV8FxdYaXZIfy5G4ALYTcfcXP//7O30YZyR+pR3pUcHUiZ3hTO/cZ3zwDByMfjCOP/41pwn/gabexugFVJL3Cs9o2pOwnyGmgEJR/Nha971XaaxOy0P0rgsLx3DlcfCBUM4bCm0FBRdL77PQXPd1LYaY/qIzEq+np4qj/s3q+9NzFCnnHGmDPRgyUj92ozrG57s9fl1fttQU9zkFFv7NZkMiUcf+Y362sQ/hnT/9Qcq7/1E/yp2VjT22SbZxv+l8HdIakZXK0nfLND3eTsTb4gf0pOE6a31ZzYtXni+cIaHbj8eqW7RvRI+kLHgl45pnhZ0WfzWLukvcrdhEZBGxbUJPMXBK2LlQG+RDvAc4CYCzgL7CbUbFsubehU39to11KGs/RHX2ahlxq5lKwhUK47D9osyYiX6dt9yVZwK5cuncKLHUlo3NsuvQ3ifCBt7hbS8+hzw+pt9NmLTKYAXATHiSdugvTVAlXiPV9IxZH78GU7/R95rx2QfOjBxX6jv/Yd//+PH//HM//+NXIb9Y0NAvMkBAtjOatOQYkwa2FoqkbEV9P1Zuhfjdi3qgZrXug3Ciu8c9UCOXdISIcmBgHDPnNkasBAAbxuJqvQk9ZQH6PRcVsaGD/SRv+jynSHYFFYxxa6Yu+PCMoxMmjYoZ+ecX9uG6faAkfdc35xFwUHOJxSXjNpNCH3UIJFZo0xaqvNP7xvGEejiuaj7N9JvZYlGFCcQ+drXzcwnZWmhaj9y1WCeOu4qbeJ1H2Nu1eEYAs9L7uDvQg2nvvPlbGsWg03R3eLRhrzhX+hk1TnKdhfTI1IfBRmxktYWPJr4FKxA5nnFuLW1kT3HqLQBeWJlmkBdmorQ5Oj7qMxz88aaNkwMmokqGCD6yxTrjZif/9W8VUnxi7yB0RsPYJzTvCU0O5AJUF8tV9AU9VCR1DGmT0xYK5oT4TmsO56K/W4Na5FkjAx1HCJJ0X1n/haEHtqQk66pJc3hGOqua6uiJPbELIBvXdtOHz8eerN2JY4rIu09QZOlWCC7GvMy6kdaFsTL4l1um5e+cg1h1/Fg628HISTx4IqOyKCl4HXe6fxZe0RVLJDTv32P383/CTLKBuLHQIGosfgAFObCjcP+/9BwGwjfQT2T/N7ij/qGKUXzjEeZ+DGop413LfhKs2/Fc4x5SnexbnYfSnegj8ty/iqAxBXGADUSsdUcGU43uhFQZKT/UCp4///lYh80L5RAcPd+iPqHQEETPWxefIG72mMG3yjW/jfOpnCaOU0D+fcRQW/gjGNHbag8dhLXzThkg1DakMNXwD2YlyIyG9uLc1YfX5M5dSKOG4hQmk7sYFOATlngLCP6E3qSDo2AWi6c1bZBSk/smx5CDtV17mLzSVYEYtS3SFm3p0UweAC2WjUqsOOk/k1uLZhl0FQ63ArawRv9hvIq5YNlYULr3Y7MZYd+mPA9NFJmFycXnBQ1lPc3ILOFEHa//1GMypjKT3BjU9EL/AFv+kQ4vr5kE2+yq/cHK2fWFpeEIBVeHpDjmFWcO+yP8NItIQ4L7h+VuY8OqzXt+pc8AKrXmHVi0SR9Q4Bze4Y8f7ox+yYck384NLyzkVf9rGdmWRV71IdmuHPzS52oqPmftc9Ij0gqjKb3z7OAefdwe/8VT+uuatQAmplEZUl1o22n1mQnJ7Lv0R9Vljcf3POx8Xfvtmv2caYW7hfx1uYQOdas8PcdJw/So1f7/H7qe2gDT2E2sGI8NLTevLqU6rH7XCJ/kxKPesqfQDkQQJ5QKOQDYEb3vOL4yIdpt55x9TDT6OxYzNwrFUGg462FfYwV1HEZrOBGpmZvbut9RP3DweFk8FV0KcUmQyRf8F0oZvf/HsBjaLzyjt/y/jL2RhPQykVftcQsRuBN7Qw1YUuBf7X0DL///3rRDfmVQAEDoScVqN9Yi0poLzGydFwlDp8fSpA8/v9vLkj86jevHTovXW6X4W2nqdu8TufhKq7F+Ek0SYTHeXdxnzAkDgXykCHDnsVI7XxpXQNfnPQj5VPPZsl+Tt2chTyT9WnhT14Emwfc+Ad4WEixnu/SsbvYHiPFqssMoTTRTjAmPNEEMNFE5FizvskfnYFubXWITAZYmB0dG0z2WeH6n2/dOWyWIr2mQ0YqiPiyC7bgSw9Qr/uQEYfbA8pznq2RYWL03kY/C75+hLZ2tiU3a4m0KFWICXc99zU5+TK3mbHWaonrWvuJEFUq09lqVGR+THVM3G2P+Ei8Pvhq8yG1+NFX//DDKRbZOqjk2aVBOlxbObyLvpni5NuPY0DMq86Lhz0OvR2z1B0cOTAliAisXQMyuaQuRSCAXl/9EHnlfkVRaVzxZpcan94+8xEc2juQlCy+b2ftituSZKywBRuzKIR7japgjLRhDz8uo0dziUA/o7Nj2BA33OuuFUx6Kvx/IigSNnpzBlCw1axHKD0eyyHHTCmFSeRsvI6Em5aEGvzTEIZhlnbf2q66JBnPUA6N5KwznD10vUnN8ApGmwPcepKXVd5QrfLbNvpQracF0qKVhD1yLt+xv4EiXh8Nu7+waV8NttAGDMTq2mJ/A81wKLfxLKjLAzugnPoudtqfjKm7vWt0dZ6/CCRbHPDk2izTeWFDPtJ9I/73j04dq6GyoFhu6VMEq6ebL2nJtkCHkstsi0hAWhlqOlNy/luD6vjW96Oz+hLunQd5R+UFnlNT5rrLmKccYEAI/WIfFvcfPSCZ8w0JQPe9u7oFuGiF/jbXqTkSmaELDGmQ5HH1yXD7kFxeV4RWTyGVgQCZVDtoqshPbjTUgRjTz+TDGXDAoFrasN2fGpVlKSSX76ERu2giOVw+U0nH0p0AyrzouHH8qAf67pwJsGD3DPM4UDQiCB5ctdtzzNhQv/Sq3oOL/E+6Vskj3j9qB8Xw1cqcCN1HqeUn3i3P+DBwE8mXcaOkX6U1EWdFBz2/YATN91RxQ2PJYxtw/2lNthPOOf1BEuG734gNqJQqBOP8u/flKDUAr7YzRgzCeItI3yIFJ8b7SudWuYiY77TJ1JP9nk5UCx/6v9XfNubGWzV6DX5lihGzpAifT6JP71va2sR/7RLssqOaEHV1sTkX5UIo42yXD7yqnB9AWY3BF4CiC48wGYKid3878NQ/Ywk3j+SR3WPkWVpXRR7WwBBSSl9LVaoMlrk1mBSBkUaV5ogO4nch0XMYCd8NAjzHxOAvTEEwnASBYssRgAaHHcf3l9QYc2xQJpM8gxHUiDCwbZnu+df//xnwCGFjBy4uU5Rl//Jzy2RVRxg67cC//5aNJK+FqGtRevU7/eHzu2B+iO4EYu9OIU2karXEz2FI/0qO1ksZPZuIjYuh3HIp488ZokaA30ff+i8Ve3f2f/pszHMUjM/eSGWGRNxYsjn0AS+8QMkQYPAAdePnilnbK+Bcww8DO3vhXQqL4VXQpX/bLgpql/18bFtOoy9aAiDiM+TNB/+v1oe3bdrKyvB95nfxNT3WbnLkc7xdK7P3gXhl1bbkRi5TCpyFogDVgMfzV8Ml4wIY3as01clyEFyM3Hp7usfT5hzmlWs/v6eXe8T0WDg92gJIH5xJ+f9Kp/uKdLiTnggV9ikMAAApvnGpunWC+h5W4Q6G1aeAIbd+CS9DgV142F10kciWSzcFoqoOJBe3UpNoy9MYJRd7t8OrUgCuAAAYpOZJhIU9LsATWHeV7LkRHkAAAA" alt="" width="100" height="30" />
              </div>
              <span style="font-size: 36px; font-weight: 600;">${formatNumber(
                data.invoicePrice,
                0
              )} บาท</span>
              <span style="font-weight: 600;">ให้ราคาสูงสุด</span>
            </div>
          </div>
        </div>

        <!-- ReferralFormSection: เว้นว่างไว้ก่อน -->
        <!-- ============================= -->
        <!-- ReferralFormSection            -->
        <!-- ============================= -->
        <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; margin-top: 8px;">
          <span style="text-align: center; font-size: 18px; font-weight: 400; color: #666666;">ราคาอ้างอิง</span>
          <div style="display: flex; flex-direction: row; align-items: center; gap: 16px; width: 100%; height: 100%;">
              ${data.references
                .map(
                  (ref, idx) => `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 8px; color: #333333;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <div style="display: flex; gap: 8px; align-items: center; flex: 1;">
                  <!-- Logo Uploader (small) -->
                  <img
                  style="width: 48px; height: 36px; object-fit: contain; flex-shrink: 0; border-radius: 6px; display: flex; align-items: center; justify-content: center;"
                    src="${safeImgSrc(ref.refLogo)}"
                    alt=""
                  />
                  <span style="color: #666666; font-size: 14px;">${
                    ref.refUrl
                  }</span>
                </div>
                <span id="ref-avg-0" style="font-weight: 600; font-size: 12px; white-space: nowrap;">
                  ราคาเฉลี่ย : ${formatNumber(
                    calculateSingleAveragePrice({
                      priceHight: ref.priceHight ?? 0,
                      priceLow: ref.priceLow ?? 0
                    }),
                    0
                  )} บาท
                </span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
                <!-- FieldImageCar: ต่ำสุด -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0; width: 100%;">
                  <img
                  style="width: 100%; height: 150px; object-fit: cover; position: relative; display: flex; align-items: center; justify-content: center; color: #AAAAAA; font-size: 14px;"
                    src="${safeImgSrc(ref.carImageLow)}"
                    alt=""
                  />
                  <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px; width: 100%;">
                    <span style="font-size: 14px; color: #666666;">ต่ำสุด</span>
                    <div style="display: flex; flex-direction: row; align-items: center; font-size: 18px; font-weight: 600; gap: 8px;">
                     <span>${formatNumber(ref.priceLow, 0)}</span>
                      <span style="white-space: nowrap;">บาท</span>
                    </div>
                  </div>
                </div>
                <!-- FieldImageCar: สูงสุด -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0; width: 100%;">
                  <img
                  style="width: 100%; height: 150px; object-fit: cover; position: relative; display: flex; align-items: center; justify-content: center; color: #AAAAAA; font-size: 14px;"
                    src="${safeImgSrc(ref.carImageHight)}"
                    alt=""
                  />
                  <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px; width: 100%;">
                    <span style="font-size: 14px; color: #666666;">สูงสุด</span>
                    <div style="display: flex; flex-direction: row; align-items: center; font-size: 18px; font-weight: 600; gap: 8px;">
                     <span>${formatNumber(ref.priceHight, 0)}</span>
                      <span style="white-space: nowrap;">บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                `
                )
                .join('')}
           </div>
        </div>

      </div>
      <!-- ============================= -->
        <!-- รายการคำนวณ ค่างานซ่อมทั้งหมด    -->
        <!-- ============================= -->
        <div style="padding: 8px 16px; margin-top: 16px;">
        <div style="margin-top: 0; border: 1px solid #DDDDDD; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 16px; font-family: sans-serif;">
  <span style="color: #333333; font-weight: 600; font-size: 16px;">
    รายการคำนวน ค่างานซ่อมทั้งหมด
  </span>

  <div>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #F5F5F5; color: #333333;">
          <th style="width: 40px; text-align: left; font-weight: 600; padding: 8px 12px;"></th>
          <th style="text-align: left; font-weight: 600; padding: 8px 12px;">รายการ</th>
          <th style="text-align: right; font-weight: 600; padding: 8px 12px; width: 112px;">จำนวน</th>
          <th style="text-align: right; font-weight: 600; padding: 8px 12px; width: 128px;">ราคา</th>
        </tr>
      </thead>
      <tbody>
        ${
          hasItems
            ? data.items
                .map(
                  (item, index) => `
                <tr style="background-color: ${
                  index % 2 === 1 ? '#F5F5F5' : 'transparent'
                };">
                  <td style="padding: 8px 12px; color: #666666;">${
                    index + 1
                  }</td>
                  <td style="padding: 8px 12px; color: #333333;">${
                    item.item_name
                  }</td>
                  <td style="padding: 8px 12px; text-align: right; color: #333333;">
                    ${item.quantity}
                  </td>
                  <td style="padding: 8px 12px; text-align: right; color: #333333;">
                    ${formatNumber(item.total_price, 0)}
                  </td>
                </tr>
                `
                )
                .join('')
            : `
                <!-- กรณีไม่มีรายการใน Array -->
                <tr>
                  <td colspan="4" style="padding: 16px; text-align: center; color: #666666;">
                    ไม่มีรายการคำนวณ
                  </td>
                </tr>
              `
        }
      </tbody>
    </table>
  </div>

  <!-- กล่องสรุปยอด -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 100%; max-width: 320px; border: 1px solid #DDDDDD; font-size: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px;">
        <span style="color: #333333;">รวม</span>
        <span style="font-weight: bold; color: #333333;">${formatNumber(
          totalPrice || 0,
          0
        )} บาท</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background-color: #F5F5F5;">
        <span style="color: #333333;">VAT 7%</span>
        <span style="font-weight: bold; color: #333333;">${formatNumber(
          vat || 0,
          0
        )} บาท</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background-color: #F5F5F5; border-top: 1px solid #DDDDDD;">
        <span style="color: #333333; font-weight: 600;">ยอดรวม VAT</span>
        <span style="font-weight: bold; color: #333333;">${formatNumber(
          totalWithVat || 0,
          0
        )} บาท</span>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
    </div>
            </div>

    

  </div>

</body>
</html>
  `;
}
