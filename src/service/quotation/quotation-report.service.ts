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

const getQuotationReports = async () => {
  try {
    return await db.quotationReport.findMany({
      include: { items: true, references: true }
    });
  } catch (error) {
    console.error('Error getting quotation reports:', error);
    return false;
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
        invoiceExpireDate: true,
        invoicePrice: true,
        items: {
          select: {
            quantity: true,
            item: {
              select: {
                name: true,
                price: true,
                unit: true
              }
            }
          }
        }
      }
    });

    if (!res) return null;

    const payload = {
      quotationId: res.quotationId,
      createdAt: res.createdAt,
      invoiceExpireDate: res.invoiceExpireDate,
      invoicePrice: res.invoicePrice,
      items: res.items.map((i) => ({
        name: i.item.name,
        price: i.item.price,
        unit: i.item.unit,
        quantity: i.quantity,
        totalPrice: i.item.price * i.quantity
      }))
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
