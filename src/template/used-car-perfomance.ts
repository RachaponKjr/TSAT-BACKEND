import path from 'path';
import { InspectionForm } from './used-car-form';
import fs from 'fs';

// สีตามคะแนน: 3 = เขียว (ดี), 2 = ส้ม (ปานกลาง), 1 หรือต่ำกว่า = แดง (ควรซ่อม)
function getScoreColor(score: number): string {
  if (score >= 3) return '#28a745';
  if (score === 2) return '#fd7e14';
  return '#C21A20';
}

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
    throw new Error(`หาไฟล์ไม่เจอในระบบที่ตำแหน่ง: ${absolutePath}`);
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'jpg' ? 'jpeg' : ext || 'jpeg';

  return `data:image/${mimeType};base64,${fileBuffer.toString('base64')}`;
};

// คำอธิบายเกรดรวม
function getGradeLabel(grade: string): string {
  const map: Record<string, string> = {
    A: 'สภาพดีเยี่ยม',
    B: 'สภาพดี',
    C: 'สภาพปานกลาง',
    D: 'ควรซ่อมแซม'
  };
  return map[grade] ?? '';
}

function getGradeLabelUsedCar(grade: string): string {
  const map: Record<string, string> = {
    A: 'ราคาตลาดสูงสุด ซื้อขายจริง',
    B: 'ราคากลางตลาด ซื้อขายจริง',
    C: 'ลดราคาลงตามมูลค่างานซ่อม หรือ ราคาต่ำสุดตลาด ซื้อขายจริง'
  };
  return map[grade] ?? '';
}

function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: '#28a745',
    B: '#28a745',
    C: '#fd7e14',
    D: '#C21A20'
  };
  return map[grade] ?? '#333333';
}

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
];

// แปลง ISO date -> วันที่แบบไทยย่อ เช่น "3 พ.ค. 67"
function formatThaiDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function mapIconService(index: number): string {
  const map: Record<number, string> = {
    0: '<img src="data:image/png;base64,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" alt="" width="32" height="32" />',
    1: '<img src="data:image/png;base64,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" alt="" width="32" height="32" />',
    2: '<img src="data:image/png;base64,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" alt="" width="36" height="24" />',
    3: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAYCAYAAABOQSt5AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQqADAAQAAAABAAAAGAAAAACaDlZ9AAAEI0lEQVRYCcWXS1LbQBCGbRyoAIv4COYGpjgA+ATBu+xsL3gUG+wT2D4BZkPxWCBOEGeVpcUBqDgniG4Qr1hRkO8XI9VYSH7JcqZqNJp+Tc/fPT1SPrfEdnp6evD29tZ+fX0t5/P5YlrT2HCxd3l7e9tPa2uafmGawKz84+PjQ5z+iXyJDXyeVW+KXAn+t729vdzT09PjFNlU7HwqbaNMJpTIggFTgeDx3k1rVxlFPwfckrHVITNS203yaylAnJyc3ONwnUVGa2tru9fX157AYa4+V0PXDRRkA7sDesnQMgMjNRBHR0d1IndvHG0RtZ5qhcmQYE/zjEPArApMKa0KjLV5PIzKyklAaIvO6AgEvQPChcYFW1kgyrb0BQi2K3RPc1qHeuSv+T5dzjMVEKSsHBIYctY/v8oQaGXjXovo7sza0fFtMPo1Z5VgLHw07CPBRhtEztHmidYfbUTg3Nzc7Ig2T0O/g3wQcQ/bleCY1Ov14sbGxgB+AHSPLGzNYz9JdiEgFClTA7Rhhw03tEASOEmLJ9HnBMMjM7vb29v9Xq83SrI5jR4Cweb0MfQVheI0JUA4BABdbzoSYcTSZoO97jQw1tfXO6x9buvwPoQmMLwIPXbKPh7v7u4cMX0grOsvViGOKBAwVMXQUHw7G+Lkl0Dztra2du2om+C1CeDBovbZR5+MruZBXuexI0MQXQaPPrGx8G+ccmynAKKHfjRCE+3MyzT1wo3qmaKqjC7D+xLlR+fIKZvLjCXD6wqIoLiFZz2qOMvcFDI5M/VozWIvKlMoFDyKphulp5mzdwf9Gt37xKNE193/qHHR5jiOzmY/Tv/s7EzfBgFA2pAXJ7dqGkFzyQwBUUr1HTGL4yp6Ly8vvwBiEPRmsxmAMouJlchkDgS7UKaEjQjk7NoSMv7zSwgEhWg/C1/02Y3t8Otyc3NzN4t10tpUjXig1zgvda7RIo42JkXMXFk10vyQ6BbR0x9nn2J2eXV1NYxzKOuaoKsbH+RTWT7hw5DRof+YdW3/O0LnGOW22cSQq7ESBwZykpFsUsvsNzluQV2bbP47vHIcH9rYJ3pUxv728Y8G6dtBqGsEy8/Pz4NoQZMS/I6R0bnvkg0NxhbIe4auP8Omec98sEHAB1f+GJ+U5Wr+r0B0L++s8aefEQFpUmbA+yPD2rTOuZ0xkZ+hERm1Y/MD+8sc7Whit2uCGS5BttQB6t4QPvBFN0G74HU0BoRhdhjDY8LZa+nsQZNCjrn+LVy92021A7mBoXWRc23+st+JfJt+oEzgE7kSZ5+NOtBrdNWxqi2Dr/voN9Ev0p0PQEg4khm2fg7kY3WM3l/G4phC9pPYaGvZSNbEeqIMp1fC69OWitSMkIXCZTiJeQHhhxhylqQRt9UwaQF4rjaawB/B6wsE3Sz/ABbhDNrMICfTAAAAAElFTkSuQmCC" alt="" width="36" height="20" />',
    4: '<img src="data:image/png;base64,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" alt="" width="32" height="32" />'
  };
  return map[index] ?? '#333333';
}

export function generatePDFUsedCarPerformace(data: InspectionForm): string {
  return ` 
   <!DOCTYPE html>
<html lang="th">

<head>
  <meta charset="UTF-8">
  <title>ใบตรวจสภาพรถยนต์</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* นำเข้าฟอนต์ภาษาไทยมาตรฐาน */
    @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@100..700&family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap');

    /* ตั้งค่าหน้ากระดาษและภาพรวม */
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
      font-family: "IBM Plex Sans Thai", sans-serif;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #333333;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
      
    /* Container หลัก */
    .container {
      max-width: 100%;
      margin: 0 auto;
      background-color: #ffffff;
    }

    /* 1. Header ส่วนหัวบริษัท */
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
      font-size: 16px;
      font-weight: 600;
      line-height: 1.2;
    }

    .company-info p,
    .company-info span {
      margin: 0;
      font-size: 14px;
      line-height: 1.3;
      display: block;

    }

    /* 2. รายละเอียดลูกค้า */
    .main-content {
      padding: 15px;
      display:flex;
      flex-direction: column;
      gap:16px
    }

    .customer-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .customer-section h5 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .meta-grid {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }

    .label-item {
      font-size: 12px;
    }

    .label-item .label-title {
      font-weight: 700;
      color: #444444;
    }

    .label-item .label-value {
      text-decoration: underline;
      font-weight: 500;
      color: #111111;
      margin-left: 2px;
    }

    /* 3. ส่วนตารางข้อมูล */
    .table-responsive {
      width: 100%;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    
    tbody tr:nth-child(even) {
  background-color: #F5F5F5;
}

    th,
    td {
      padding: 6px 8px;
      text-align: left;
      vertical-align: middle;
    }

    th {
      font-weight: 600;
      font-size:10px;
      text-align: center;
      text-shadow: none;
    }

    .text-center {
      text-align: center;
    }

    .text-gray {
      color: #666666;
    }
    
    .text-white {
        color: #ffffff;
    }

    /* หัวข้อหลักในตาราง (Category) */
    // .category-row {
    //   background-color: #F9FAFB !important;
    // }

    .category-row td {
      font-weight: 700;
      color: #374151;
      font-size: 14px;
    }

    /* วงกลมผลการตรวจ (Pass / Fail) */
    .result-container {
      display: flex;
      gap: 6px;
      justify-content: center;
      align-items: center;
    }

    .circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }

    .circle-pass {
      border: 1.5px solid #3EB95B;
    }

    .circle-pass.active {
      background-color: #3EB95B;
    }

    .circle-fail {
      border: 1.5px solid #C21A20;
    }

    .circle-fail.active {
      background-color: #C21A20;
    }

    /* 4. Footer ส่วนท้ายและลายเซ็น */
    .footer-section {
      display: flex;
      flex-direction: row;
      gap: 20px;
      border-top: 1px solid #CCCCCC;
      padding-top: 15px;
      margin-top: 15px;
    }

    .remark-box {
      display: flex;
      flex-direction: row;
      gap: 8px;
      flex: 1;
      align-items: start;
    }

    .remark-box span {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .remark-line {
      border: 1px solid #CCCCCC;
      flex: 1;
      min-height: 45px;
      background-color: #ffffff;
    }

    .signature-box {
      display: flex;
      flex-col: column;
      flex-direction: column;
      gap: 10px;
      min-w: 220px;
      width: 220px;
    }

    .sig-row {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: 6px;
    }

    .sig-row span {
      font-size: 14px;
      white-space: nowrap;
    }

    .sig-underline {
      border-bottom: 1px dashed #999999;
      flex: 1;
      height: 15px;
    }

    /* ส่วนรายละเอียดรูปภาพประกอบด้านล่าง */
    .details-gallery {
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    /* การควบคุมการตัดหน้าเวลาพิมพ์ PDF */
    @media print {

      tr,
      .footer-section {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .page-break {
        clear: both;
        break-before: page !important;
        page-break-before: always !important;
      }
    }
  </style>
</head>

<body>

  <div class="container">
    <div class="header">
    <img src="data:image/webp;base64,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" alt="" width="462" height="104" />
      <div class="company-info">
        <h6>บริษัท ท็อป เซอร์วิส ออโต้ เทคนิค จำกัด (Top Service Auto Technic Co., Ltd.)</h6>
        <p>เลขที่ 236 ซอยลาดพร้าว 26 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร โทร. 02-0444955</p>
        <span>เลขที่ผู้เสียภาษี 010 556 018 543 3</span>
      </div>
    </div>

    <div class="main-content">
        <span style="font-weight: bold;color:#666666;">
            ผลการตรวจเช็ครถมือ 2 Porsche (Pre-Purchase Inspection : PPI)
        </span>
  <div style="border: 1px solid #ccc; border-radius: 6px; padding: 20px; font-family: sans-serif; color: #333; margin-bottom: 8px; font-size: 12px; line-height: 1.4;">
    
    <!-- แถวที่ 1: ข้อมูลลูกค้าและข้อมูลรถ -->
    <div style="display: flex; margin-bottom: 16px;">
      <!-- คอลัมน์ 1: ลูกค้า -->
      <div style="flex: 0 0 35%; padding-right: 10px;">
        <div style="font-size: 1em; color: #777; margin-bottom: 4px;">ลูกค้า</div>
        <div style="font-weight: bold; font-size: 1.2em; color: #222;">คุณ${
          data.customerName
        }</div>
      </div>
      <!-- คอลัมน์ 2: รุ่นรถ -->
      <div style="flex: 0 0 40%; padding-right: 10px;">
        <div style="font-size: 1em; color: #777; margin-bottom: 4px;">รุ่นรถ</div>
        <div style="font-weight: bold; font-size: 1.2em; color: #222;">Porsche ${
          data.carModel
        }</div>
      </div>
      <!-- คอลัมน์ 3: รหัสตัวถัง -->
      <div style="flex: 0 0 25%;">
        <div style="font-size: 1em; color: #777; margin-bottom: 4px;">รหัสตัวถัง (VIN)</div>
        <div style="font-weight: bold; font-size: 1.2em; color: #222;">${
          data.vin
        }</div>
      </div>
    </div>
    
    <!-- แถวที่ 2: ข้อมูลเพิ่มเติม ผู้ตรวจ และผู้อนุมัติ -->
    <div style="display: flex; align-items: flex-start;">
      <!-- คอลัมน์ 1: ทะเบียน / ปีรถ / เลขกิโลเมตร -->
      <div style="flex: 0 0 35%; display: flex; gap: 24px; padding-right: 10px;">
        <div>
          <div style="font-size: 1em; color: #777; margin-bottom: 4px;">ทะเบียน</div>
          <div style="font-weight: bold; font-size: 1.2em; color: #222;">${
            data.licensePlate
          }</div>
        </div>
        <div>
          <div style="font-size: 1em; color: #777; margin-bottom: 4px;">ปีรถ</div>
          <div style="font-weight: bold; font-size: 1.2em; color: #222;">${
            data.modelYear
          }</div>
        </div>
        <div>
          <div style="font-size: 1em; color: #777; margin-bottom: 4px;">เลขกิโลเมตร</div>
          <div style="font-weight: bold; font-size: 1.2em; color: #222;">${
            data.odometer
          } กม.</div>
        </div>
      </div>
      <!-- คอลัมน์ 2: ผู้ตรวจเช็ค -->
      <div style="flex: 0 0 40%; padding-right: 10px;">
        <div style="font-size: 1em; color: #777; margin-bottom: 4px;">ผู้ตรวจเช็ค</div>
        <div style="font-weight: bold; font-size: 1.2em; color: #222;">
          ${
            data.inspectorName
          } <span style="font-weight: normal; color: #444; margin-left: 12px; font-size: 1em;">${formatThaiDate(
            data.inspectedAt
          )}</span>
        </div>
      </div>
      <!-- คอลัมน์ 3: ผู้อนุมัติ -->
      <div style="flex: 0 0 25%;">
        <div style="font-size: 1em; color: #777; margin-bottom: 4px;">ผู้อนุมัติ</div>
        <div style="font-weight: bold; font-size: 1.2em; color: #222;">
          ${data.approverName}
          <span style="font-weight: normal; color: #444; margin-left: 12px; font-size: 1em;">${formatThaiDate(
            data.approvedAt
          )}</span>
        </div>
      </div>
    </div>

  </div>
  
  <div style="width:100%;display:flex;gap:24px">
      <!--ภาพรูปรถ-->
      <div style="width: 100%; height: 300px; background-color: lightblue; border-radius: 6px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
  <img 
    src='${convertLocalFileToBase64(data.imageCar)}'  
    alt="รูปรถ" 
    style="width: 100%; height: 100%; object-fit: cover; display: block;"
  />
</div>
      <div style="display:flex;flex-direction: column; gap:32px;flex-basis:18rem;flex-shrink:0">
          <div style="border: 1px solid #ccc; border-radius: 6px; padding: 12px;display:flex;flex-direction: column; gap:24px;">
              <img src="data:image/webp;base64,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" alt="" width="100" height="24" />
          <div style="display:flex;flex-direction: column;color:#666666;">
              <span style="font-size:14px">ผลการประเมิน</span>
              <span style="font-size:18px;font-weight: bold">${getGradeLabelUsedCar(
                data?.overallGrade
              )}</span>
          </div>
         <div style="display:flex; flex-direction: row; justify-content:space-between;">
  
  <!-- กล่อง Overall Grade -->
  <div style="display:flex; flex-direction: column;">
    <span style="font-size:14px; color:#666666; margin-bottom: 4px;">Overall Grade</span>
    <span style="color:${getGradeColor(
      data?.overallGrade
    )}; font-size:36px; font-weight:bold; line-height:0.9;">${data?.overallGrade}</span>
    <span style="color:${getGradeColor(
      data?.overallGrade
    )}; font-size:15px; font-weight:bold; margin-top: 2px;">${getGradeLabel(
      data?.overallGrade
    )}</span>
  </div>

  <!-- กล่องคะแนนรวม -->
  <div style="display:flex; flex-direction: column;">
    <span style="font-size:14px; color:#666666; margin-bottom: 4px;">คะแนนรวม</span>
    <span style="color:${getGradeColor(
      data?.overallGrade
    )}; font-size:36px; font-weight:bold; line-height:0.9;">${data?.totalScore}</span>
    <span style="color:#999999; font-size:15px; font-weight:bold; margin-top: 2px;">/ ${data?.maxScore}</span>
  </div>

</div>
          </div>
          <div style="display:flex;flex-direction: column;font-size:12px;color:#999999;gap:6px;">
              <span style="font-weight: bold">หลักเกณฑ์การให้คะแนน</span>
              <div style="display:flex;flex-direction: column;gap:2px">
              <div style="display:flex;flex-direction: row;justify-content:space-between">
                <span>สภาพใช้งานได้ปกติ</span>
                <span>3 คะแนน</span>
              </div>
              <div style="display:flex;flex-direction: row;justify-content:space-between">
                <span>ถึงกำหนดเปลี่ยนแต่ยังใช้งานได้</span>
                <span>2 คะแนน</span>
              </div>
              <div style="display:flex;flex-direction: row;justify-content:space-between">
                <span>สภาพชำรุดต้องเปลี่ยน</span>
                <span>1 คะแนน</span>
              </div>
              </div>
          </div>
      </div>
  </div>
  
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 24px; margin-bottom: 24px;">
        ${data.categoryResults
          .map((cat, index) => {
            const totalItems = cat.itemResults.length;
            // นับจำนวนผ่าน (3), ปานกลาง (2), ไม่ผ่าน (1) จากคะแนนช่องแรกสุด (ประเมินสภาพ)
            const passCount = cat.itemResults.filter(
              (item) => item.selectScore[0]?.score === 3
            ).length;
            const warnCount = cat.itemResults.filter(
              (item) => item.selectScore[0]?.score === 2
            ).length;
            const failCount = cat.itemResults.filter(
              (item) =>
                item.selectScore[0]?.score === 1 ||
                item.selectScore[0]?.score === 0
            ).length;

            return `
            <div style="background: #F8F9FB; padding: 16px 16px; border-radius: 6px; border: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; width: 100%; box-sizing: border-box;">
            <div style="display:flex;flex-direction: row; gap:16px">
            ${mapIconService(index)}
            <!-- หัวข้อหมวดหมู่ -->
            <div style="display:flex;flex-direction: column;">
              <div style="font-size: 16px; color: #222222; font-weight: bold; line-height: 1.3;">
                ${cat.categoryName}
              </div>
              
              <!-- คะแนนรวมหมวดหมู่ -->
              <div style="font-size: 14px; color: #999999; font-weight: 500;">
                <span style="font-size: 20px; font-weight: bold; color: #333333;">${
                  cat.score
                }</span> / ${cat.maxScore} คะแนน
              </div>
              
              <!-- สรุปรายการ (Badges) -->
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666666; margin-top: 8px;">
                <span>${totalItems} รายการ :</span>
                
                ${
                  passCount > 0
                    ? `
                <div style="display: flex; align-items: center; gap: 4px; background-color: #E6F4EA; color: #1E8E3E; padding: 2px 6px; border-radius: 12px; font-weight: bold;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd" />
                  </svg>
                  <span>${passCount}</span>
                </div>`
                    : ''
                }
                
                ${
                  warnCount > 0
                    ? `
                <div style="display: flex; align-items: center; gap: 4px; background-color: #FEF3C7; color: #D97706; padding: 2px 6px; border-radius: 12px; font-weight: bold;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 20 20">
                    <path d="M0 0h20v20H0z" fill="none" />
                    <path fill="currentColor" d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20m5-11H5v2h10z" />
                  </svg>
                  <span>${warnCount}</span>
                </div>`
                    : ''
                }
                
                ${
                  failCount > 0
                    ? `
                <div style="display: flex; align-items: center; gap: 4px; background-color: #FEE2E2; color: #DC2626; padding: 2px 6px; border-radius: 12px; font-weight: bold;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
                    <path d="M0 0h32v32H0z" fill="none" />
                    <path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z" />
                  </svg>
                  <span>${failCount}</span>
                </div>`
                    : ''
                }
            </div>

                
              </div>
            </div>  
            </div>
           `;
          })
          .join('')}
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
