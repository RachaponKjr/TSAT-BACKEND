type SelectScore = {
  score: number;
  description: string;
};

type itemResults = {
  item: string;
  description: string;
  selectScore: SelectScore[];
};

type categoryResults = {
  categoryName: string;
  score: number;
  maxScore: number;
  itemResults: itemResults[];
};

export interface InspectionForm {
  customerName: string;
  carModel: string;
  modelYear: string;
  vin: string;
  pdfUrl: string;
  imageCar: string;
  performancePdfUrl: string;
  odometer: string;
  licensePlate: string;
  inspectorName: string;
  inspectedAt: string;
  approverName: string;
  approvedAt: string;
  overallGrade: string;
  totalScore: number;
  maxScore: number;
  categoryResults: categoryResults[];
}

// ---- Helpers ----

// สีตามคะแนน: 3 = เขียว (ดี), 2 = ส้ม (ปานกลาง), 1 หรือต่ำกว่า = แดง (ควรซ่อม)
function getScoreColor(score: number): string {
  if (score >= 3) return '#28a745';
  if (score === 2) return '#fd7e14';
  return '#C21A20';
}

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
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.'
];

// แปลง ISO date -> วันที่แบบไทยย่อ เช่น "3 พ.ค. 67"
function formatThaiDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const year = (d.getFullYear() + 543) % 100;
  return `${day} ${month} ${year}`;
}

// 2. ฟังก์ชัน HTML Template ที่รับ Object ทั้งก้อนไปใช้งาน
export function generatePDFUsedCar(data: InspectionForm): string {
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

    body {
      font-family: 'IBM Plex Sans Thai', 'Anuphan', 'Sarabun', sans-serif;
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

    /* 2. รายละเอียดลูกค้า */
    .main-content {
      padding: 15px;
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
      font-size: 12px;
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
      font-size:12px;
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

    <div class="main-content ">
      <div style="border: 1px solid #ccc; padding: 8px 16px; font-family: sans-serif; color: #333; margin-bottom: 8px;font-size:12px">
  <!-- แถวที่ 1: ข้อมูลรถ -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 0px;">
    <div style="flex: 1;">
      <div style="font-size: 0.85em; color: #666;">ลูกค้า</div>
      <div style="font-weight: bold; font-size: 1.1em;">คุณ ${
        data.customerName
      }</div>
    </div>
    <div style="flex: 1.2;">
      <div style="font-size: 0.85em; color: #666;">รุ่นรถ</div>
      <div style="font-weight: bold; font-size: 1.1em;">${data.carModel}</div>
    </div>
    <div style="flex: 1;">
      <div style="font-size: 0.85em; color: #666;">รหัสตัวถัง (VIN)</div>
      <div style="font-weight: bold; font-size: 1.1em;">${data.vin}</div>
    </div>
    <div style="flex: 0.5;">
      <div style="font-size: 0.85em; color: #666;">ทะเบียน</div>
      <div style="font-weight: bold; font-size: 1.1em;">${
        data.licensePlate
      }</div>
    </div>
    <div style="flex: 0.3;">
      <div style="font-size: 0.85em; color: #666;">ปีรถ</div>
      <div style="font-weight: bold; font-size: 1.1em;">${data.modelYear}</div>
    </div>
    <div style="flex: 0.5;">
      <div style="font-size: 0.85em; color: #666;">เลขกิโลเมตร</div>
      <div style="font-weight: bold; font-size: 1.1em;">${
        data.odometer
      } กม.</div>
    </div>
  </div>

  <!-- เส้นคั่น -->
  <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 8px;">

  <!-- แถวที่ 2: ผลการประเมิน -->
  <div style="display: flex; align-items: center;">
    <div style="flex: 0.8;">
      <div style="font-size: 0.85em; color: #666;">ผลการประเมิน</div>
      <div style="font-weight: bold; font-size: 1.1em;">${getGradeLabelUsedCar(
        data.overallGrade
      )}</div>
    </div>
    <div style="flex: 1; border-left: 1px solid #ccc; padding-left: 15px; display: flex; gap: 20px;">
      <div>
        <div style="font-size: 0.85em; color: #666;">Overall Grade</div>
        <div style="font-weight: bold; font-size: 1.1em; color: ${getGradeColor(
          data.overallGrade
        )};">${data.overallGrade} ${getGradeLabel(data.overallGrade)}</div>
      </div>
      <div>
        <div style="font-size: 0.85em; color: #666;">คะแนนรวม</div>
        <div style="font-weight: bold; font-size: 1.1em; color: ${getGradeColor(
          data.overallGrade
        )};">${data.totalScore} / ${data.maxScore}</div>
      </div>
    </div>

    <div style="flex: 1.5; border-left: 1px solid #ccc; padding-left: 15px; display: flex; gap: 30px;">
      <div>
        <div style="font-size: 0.85em; color: #666;">ผู้ตรวจเช็ค</div>
        <div style="font-weight: bold; font-size: 1.1em;">${
          data.inspectorName
        } <span style="font-weight: normal; color: #333;">${formatThaiDate(
          data.inspectedAt
        )}</span></div>
      </div>
      <div>
        <div style="font-size: 0.85em; color: #666;">ผู้อนุมัติ</div>
        <div style="font-weight: bold; font-size: 1.1em;">${
          data.approverName
        } <span style="font-weight: normal; color: #333;">${formatThaiDate(
          data.approvedAt
        )}</span></div>
      </div>
    </div>
  </div>
</div>

 <div class="table-responsive">
  <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
    <thead>
      <tr style="background-color: #000000; color: white;">
        <th style="padding: 10px; text-align: center;">ลำดับ</th>
        <th style="padding: 10px; text-align: left;">รายการตรวจเช็ค</th>
        <th style="padding: 10px; text-align: left;">มาตรฐานการวัด</th>
        <th style="padding: 10px; text-align: center;">คะแนนประเมินสภาพ</th>
        <th style="padding: 10px; text-align: center;">คะแนนระยะทาง</th>
        <th style="padding: 10px; text-align: center;">คะแนนอายุการใช้งาน</th>
      </tr>
    </thead>
    <tbody>
      ${data.categoryResults
        .map((category, dx) => {
          const headerRow = `
          <tr style="background-color: #ffffff;border-bottom: 1px solid #eee;">
          <th colspan="6" style="padding: 10px 10px 4px 10px; text-align: left; border-bottom: 1px solid #ddd;">
          ${dx + 1}.${
            category.categoryName
          } <span style="float: right;">คะแนนรวม : ${category.score} / ${
            category.maxScore
          } คะแนน</span>
          </th>
          </tr>`;

          const itemRows = category.itemResults
            .map((item, idx) => {
              const conditionScore = item.selectScore[0];
              const mileageScore = item.selectScore[1];
              const ageScore = item.selectScore[2];
              const color = getScoreColor(conditionScore?.score ?? 0);

              return `
              <tr>
                <td style="text-align: center;">${dx + 1}.${idx + 1}</td>
                <td>${item.item}</td>
                <td style="color: ${color};">${item.description ?? '-'}</td>
                <td style="text-align: center;">${
                  conditionScore?.score ?? ''
                }</td>
                <td style="text-align: center;">${
                  mileageScore?.score ?? ''
                }</td>
                <td style="text-align: center;">${ageScore?.score ?? ''}</td>
              </tr>`;
            })
            .join('');

          return headerRow + itemRows;
        })
        .join('')}
    </tbody>
  </table>
</div>

    </div>
  </div>

</body>

</html>
  `;
}
