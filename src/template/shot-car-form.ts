import { IDataService } from '../controllers/pdf.controller';

interface ShotCarForm {}

// 2. ฟังก์ชัน HTML Template ที่รับ Object ทั้งก้อนไปใช้งาน
export function generatePDFQS(data: IDataService): string {
  const category = data.categories;
  return `

  `;
}
