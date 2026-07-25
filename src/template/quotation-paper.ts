/* eslint-disable no-console */
import dayjs from 'dayjs';
import { ReqOpenQuotationReport, ReqReferences } from '../types/quotation.type';
import fs from 'fs';
import path from 'path';

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
  // 1. ตัดส่วนหัวเว็บไซต์และคำว่า uploads ตัวแรกออกให้หมด ให้เหลือแค่ชื่อไฟล์เพียวๆ
  const fileName = relativePath.replace(
    /^https?:\/\/topserviceautotechnic\.com\/uploads\/(uploads\/)?/,
    ''
  );

  // 2. เอาชื่อไฟล์มาต่อเข้ากับโฟลเดอร์ uploads ตรงๆ (ไม่มีคำว่า pdf แล้ว)
  const cleanPath = path.join('uploads', fileName);

  // 3. ชี้พาร์ทจากโฟลเดอร์นอกสุดของโปรเจกต์ (TSAT-BACKEND)
  const absolutePath = path.join(process.cwd(), cleanPath);

  // 4. ตรวจสอบและอ่านไฟล์ออกมาเป็น Base64
  if (!fs.existsSync(absolutePath)) {
    console.warn(`[Warning] หาไฟล์ไม่เจอ: ${absolutePath}`);
    return ''; // หรือจะใส่ Default Image Base64 แทนก็ได้ครับ
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'jpg' ? 'jpeg' : ext || 'jpeg';

  return `data:image/${mimeType};base64,${fileBuffer.toString('base64')}`;
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
      B: '#28a745',
      C: '#fd7e14',
      D: '#C21A20'
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
  return `
  <!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ใบเสนอราคา / รายการประเมินมูลค่ารถ</title>
<!-- 1. ดึง Tailwind CSS (ไฟล์ Minified ปลอดภัย ไม่กิน Spec เครื่อง) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" />

<!-- 2. ดึง Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>

    @page {
      size: A4 portrait;
      margin: 10mm;
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
<body class="bg-white">

  <!-- SidePage -->
  <div class="flex flex-col flex-1 h-screen bg-white gap-0">
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
    <div class="flex-1 flex flex-col px-4 py-2" style="max-width: 80%;margin:auto">

      <!-- Header Section -->
      <div class="flex justify-between items-center mb-0">
        <span class="text-base xl:text-xl text-[#666666] font-semibold">
          ใบเสนอราคา / รายการประเมินมูลค่ารถ
        </span>
        <div class="flex flex-row gap-12">
          <!-- เลขที่ (disabled) -->
          <div class="flex flex-col">
            <label style="font-size:10px" class="text-[#666666]">เลขที่:</label>
            <span style="font-size:14px font-size:600" class="text-[#333333]">${data?.quotationId}</span>
          </div>
          <!-- วันที่ (disabled) -->
          <div class="flex flex-col">
            <label style="font-size:10px" class="text-[#666666]">วันที่</label>
            <span  style="font-size:14px font-size:600"  class="text-[#333333]">${dayjs(
              data?.createdAt
            ).format('DD MMM YYYY')}</span>
          </div>
          <!-- วันที่หมดอายุ -->
          <div class="flex flex-col">
            <label style="font-size:10px" class="text-[#666666]">วันที่หมดอายุ</label>
            <span style="font-size:14px; font-size:600" class="text-[#333333]">${dayjs(
              data?.invoiceExpireDate
            ).format('DD MMM YYYY')}</span>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="flex flex-row gap-4">

          <!-- Left Card: Car Info & Evaluation -->
          <div class="flex flex-col flex-1 rounded-lg border border-[#DDDDDD]">

            <!-- Section 1: ข้อมูลรถยนต์ -->
            <div class="p-3 xl:p-6 flex flex-col gap-0">
              <span class="text-[#666666] font-bold text-base">ข้อมูลรถยนต์</span>
              <div class="flex flex-col gap-1">
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">ลูกค้า</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${
                    data.report.customerName
                  }</div>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">รุ่นรถ</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${
                    data.report.carModel
                  }</div>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">รหัสตัวถัง (VIN)</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${
                    data.report.vin
                  }</div>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">ทะเบียน</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${
                    data.report.licensePlate
                  }</div>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">ปีรถ</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${
                    data.report.modelYear
                  }</div>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <label class="text-[#666666] text-sm xl:text-base">เลขกิโลเมตร</label>
                  <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">${formatNumber(
                    data.report.odometer,
                    0
                  )}</div>
                </div>
              </div>
            </div>

            <!-- Section 2: ผลการประเมิน -->
            <div class="p-2 flex flex-col gap-0">
              <span class="text-[#333333] font-bold text-lg">ผลการประเมิน</span>
              <div class="flex flex-row items-center justify-between">
                <!-- Grade Left Side -->
                <div class="flex flex-1 items-baseline gap-3">
                  <span class="leading-none font-bold "
                  style="color: ${getGradeColor(
                    data.report.overallGrade ?? 'A'
                  )}; font-size: 54px"
                  >${data.report.overallGrade}</span>
                  <span class="text-lg xl:text-xl font-bold text-[#1CA44D]">${getGradeLabel(
                    data.report.overallGrade ?? 'A'
                  )}</span>
                </div>
                <!-- Score Right Side -->
                <div class="flex flex-1 flex-col items-end justify-center gap-1">
                  <span class="text-sm text-[#666666]">คะแนนรวม</span>
                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl xl:text-[40px] leading-none font-bold" style="color: ${getGradeColor(
                      data.report.overallGrade ?? 'A'
                    )}">${data.report.totalScore ?? 0}</span>
                    <span class="text-2xl xl:text-xl font-semibold text-[#888888]">/ ${
                      data.report.maxScore ?? 0
                    }</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px w-full bg-[#DDDDDD]"></div>

            <!-- Section 3: ผู้ตรวจเช็ค / ผู้อนุมัติ -->
            <div class="p-2 xl:p-4 flex flex-col gap-3">
              <div class="flex flex-row justify-between items-center">
                <label class="text-[#666666] text-sm xl:text-base">ผู้ตรวจเช็ค</label>
                <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">
                  ${
                    data.report.inspectorName
                  } <span class="font-normal text-[#555555]">(${dayjs(
                    data.report.inspectedAt
                  ).format('DD/MM/YYYY')})</span>
                </div>
              </div>
              <div class="flex flex-row justify-between items-center">
                <label class="text-[#666666] text-sm xl:text-base">ผู้อนุมัติ</label>
                <div class="text-[#333333] font-semibold text-right text-sm xl:text-base">
                  ${
                    data.report.approverName
                  } <span class="font-normal text-[#555555]">(
                    ${dayjs(data.report.approvedAt).format('DD/MM/YYYY')}
                  )</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Card: Empty Space for other info -->
          <div class="border border-[#DDDDDD] flex-1 rounded-lg bg-white flex flex-col gap-0">
            <img
            style="flex: 1; width: 100%;hight:100%; object-fit: cover;"
              class=" object-cover relative"
              src="${convertLocalFileToBase64(data?.report?.imageCar || '')}"
              alt=""
            />
            <div class="text-[#333333] flex flex-col gap-2 justify-between h-max px-4 py-3">
              <div class="flex flex-row gap-2 items-center justify-between">
                <span class="text-[#C21A20] font-semibold">เสนอราคา</span>
                <img src="data:image/webp;base64,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" alt="" width="100" height="104" />
              </div>
              <span class="text-4xl font-semibold">${formatNumber(
                data.invoicePrice,
                0
              )} บาท</span>
              <span class="font-semibold">ให้ราคาสูงสุด</span>
            </div>
          </div>
        </div>

        <!-- ReferralFormSection: เว้นว่างไว้ก่อน -->
        <!-- ============================= -->
        <!-- ReferralFormSection            -->
        <!-- ============================= -->
        <div class="flex flex-col justify-center w-full mt-2 ">
          <span class="text-center text-lg font-normal text-[#666666]">ราคาอ้างอิง</span>
          <div class="flex flex-row items-center gap-4 w-full h-full">
              ${data.references.map(
                (ref, idx) => `
            <div class="w-full h-full flex flex-col gap-4 text-[#333333]">
              <div class="flex items-center justify-between gap-2">
                <div class="flex gap-2 items-center flex-1">
                  <!-- Logo Uploader (small) -->
                  <img
                  style="width: 56px;height: 56px;object-fit: cover;"
                    class="shrink-0 rounded-md flex items-center justify-center"
                    src="${safeImgSrc(ref.refLogo)}" 
                    alt=""
                  />
                  <span class="text-[#666666] text-sm">${ref.refUrl}</span>
                </div>
                <span id="ref-avg-0" class="font-semibold text-xs xl:text-base text-nowrap">
                  ราคาเฉลี่ย : ${formatNumber(
                    calculateSingleAveragePrice({
                      priceHight: ref.priceHight ?? 0,
                      priceLow: ref.priceLow ?? 0
                    }),
                    0
                  )} บาท
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- FieldImageCar: ต่ำสุด -->
                <div class="flex flex-col items-start gap-0 w-full">
                  <img
                  style="width: 100%;height: 150px;object-fit: cover;"
                    class=" relative flex items-center justify-center text-[#AAAAAA] text-sm"
                    src="${safeImgSrc(ref.carImageLow)}"
                    alt=""
                  />
                  <div class="flex flex-col gap-0 w-full">
                    <span class="text-sm text-[#666666]">ต่ำสุด</span>
                    <div class="flex flex-row items-center text-lg font-semibold gap-2">
                     <span>${formatNumber(ref.priceLow, 0)}</span>
                      <span class="text-nowrap">บาท</span>
                    </div>
                  </div>
                </div>
                <!-- FieldImageCar: สูงสุด -->
                <div class="flex flex-col items-start gap-0 w-full">
                  <img
                  style="width: 100%;height: 150px;object-fit: cover;"
                    class="relative flex items-center justify-center text-[#AAAAAA] text-sm"
                    src="${safeImgSrc(ref.carImageHight)}"
                    alt=""
                  />
                  <div class="flex flex-col gap-0 w-full">
                    <span class="text-sm text-[#666666]">สูงสุด</span>
                    <div class="flex flex-row items-center text-lg font-semibold gap-2">
                     <span>${formatNumber(ref.priceHight, 0)}</span>
                      <span class="text-nowrap">บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                `
              )}
           </div>
        </div>
    
      </div>
      <!-- ============================= -->
        <!-- รายการคำนวณ ค่างานซ่อมทั้งหมด    -->
        <!-- ============================= -->
        <div class="px-4 py-2 mt-4">
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
