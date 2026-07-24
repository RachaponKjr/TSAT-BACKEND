/* eslint-disable no-console */
import { ReqOpenQuotationReport } from '../../types/quotation.type';
import { prisma as db } from '../../libs/prisma';

const createQuotationReport = async (data: ReqOpenQuotationReport) => {
  try {
    return await db.quotationReport.create({
      data,
      include: { items: true, references: true }
    });
  } catch (error) {
    console.error('Error creating quotation report:', error);
    return false;
  }
};

// 1. สร้าง Interface สำหรับรับ Params เข้ามาจาก Controller
interface GetQuotationReportsParams {
  page?: number;
  limit?: number;
  search?: string;
}

const getQuotationReports = async (params: GetQuotationReportsParams = {}) => {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const search = params.search || '';

    // คำนวณข้ามจำนวนแถว (Offset)
    const skip = (page - 1) * limit;

    // 2. สร้างเงื่อนไขการค้นหา (Where condition)
    const whereCondition = search
      ? {
          OR: [
            { quotationId: { contains: search, mode: 'insensitive' as const } },
            { remark: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    // 3. ดึงข้อมูลแบบดึงพร้อมกัน 2 คำสั่ง (ดึงข้อมูล + นับจำนวนทั้งหมด) เพื่อประสิทธิภาพ
    const [reports, totalItems] = await Promise.all([
      db.quotationReport.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc' // เรียงจากล่าสุดไปเก่าสุด
        },
        include: { items: true, references: true }
      }),
      db.quotationReport.count({
        where: whereCondition
      })
    ]);

    // 4. Map โครงสร้างข้อมูลส่งกลับ
    const data = reports.map((item) => ({
      quotationId: item.quotationId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      invoiceExpireDate: item.invoiceExpireDate,
      invoicePrice: item.invoicePrice,
      remark: item.remark ?? '',
      items: item.items, // (ใส่เพิ่มไว้ให้ เผื่อหน้าบ้านใช้)
      references: item.references // (ใส่เพิ่มไว้ให้ เผื่อหน้าบ้านใช้)
    }));

    // 5. คืนค่าเป็นก้อน Object ให้ Controller นำไปใช้ทำ Pagination
    return {
      data,
      totalItems
    };
  } catch (error) {
    console.error('Error getting quotation reports:', error);
    // แนะนำให้ throw error ออกไปเพื่อให้ catch ใน controller ดักจับได้สมบูรณ์
    throw error;
  }
};

const getQuotationReportById = async (id: string) => {
  try {
    return await db.quotationReport.findUnique({
      where: { id },
      include: { items: true, references: true }
    });
  } catch (error) {
    console.error('Error getting quotation report by ID:', error);
    return false;
  }
};

const updateQuotationReport = async (
  id: string,
  data: Partial<ReqOpenQuotationReport>
) => {
  try {
    return await db.quotationReport.update({
      where: { id },
      data
    });
  } catch (error) {
    console.error('Error updating quotation report:', error);

    return false;
  }
};

const deleteQuotationReport = async (id: string) => {
  try {
    return await db.quotationReport.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting quotation report:', error);
    return false;
  }
};

const quotationNumber = () => {
  try {
    const now = new Date();

    const year = now.getFullYear().toString().slice(-2); // ได้ 26
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // ได้ 07
    const day = now.getDate().toString().padStart(2, '0'); // ได้ 21

    const hours = now.getHours().toString().padStart(2, '0'); // ได้ 09
    const minutes = now.getMinutes().toString().padStart(2, '0'); // ได้ 47
    const seconds = now.getSeconds().toString().padStart(2, '0'); // ได้ 31

    const code = `QS${year}${month}${day}${hours}${minutes}${seconds}`;

    return code;
  } catch (error) {
    console.error('Error generating quotation number:', error);
    return false;
  }
};

const getquotationInfo = async (id: string) => {
  try {
    const res = await db.quotationReport.findUnique({
      where: { quotationId: id },
      select: {
        quotationId: true,
        createdAt: true,
        updatedAt: true,
        invoiceExpireDate: true,
        invoicePrice: true
      }
    });

    if (!res) return null;

    const payload = {
      quotationId: res.quotationId,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      invoiceExpireDate: res.invoiceExpireDate,
      invoicePrice: res.invoicePrice
    };

    return payload;
  } catch (error) {
    console.error('Error getting quotation info:', error);
    return false;
  }
};

export {
  createQuotationReport,
  getQuotationReports,
  getQuotationReportById,
  updateQuotationReport,
  deleteQuotationReport,
  quotationNumber,
  getquotationInfo
};
