/* eslint-disable no-console */
import { prisma as db } from '../../libs/prisma';
import { ReqOpenQuotationReportItem } from '../../types/quotation.type';

const createQuotationItem = async (data: ReqOpenQuotationReportItem[]) => {
  try {
    // 🟢 ใช้ createMany สำหรับบันทึกข้อมูลหลายแถวทีเดียว
    const result = await db.quotationReportItem.createMany({
      data: data,
      skipDuplicates: true // (Optional) ถ้ามีข้อมูลซ้ำสามารถข้ามได้ตามต้องการ
    });

    return result;
  } catch (error) {
    console.error('Error creating quotation items:', error);
    throw error;
  }
};

const getQuotationItems = async () => {
  try {
    return await db.quotationReportItem.findMany({ include: { item: true } });
  } catch (error) {
    console.error('Error getting quotation items:', error);
    throw error;
  }
};

const getQuotationItemById = async (id: string) => {
  try {
    return await db.quotationReportItem.findUnique({
      where: { id },
      include: { item: true }
    });
  } catch (error) {
    console.error('Error getting quotation item by id:', error);
    throw error;
  }
};

const updateQuotationItem = async (
  id: string,
  data: Partial<ReqOpenQuotationReportItem>
) => {
  try {
    return await db.quotationReportItem.update({ where: { id }, data });
  } catch (error) {
    console.error('Error updating quotation item:', error);
    throw error;
  }
};

const deleteQuotationItem = async (id: string) => {
  try {
    return await db.quotationReportItem.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting quotation item:', error);
    throw error;
  }
};

const getQuotationItemByQuotationId = async (quotationId: string) => {
  try {
    const items = await db.quotationReportItem.findMany({
      where: { quotationReportId: quotationId },
      include: { item: true }
    });

    if (!items || items.length === 0) {
      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0
      };
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    const formattedItems = items.map((reportItem) => {
      const quantity = reportItem.quantity || 0;
      const unitPrice = reportItem.item?.price || 0;
      const subTotal = quantity * unitPrice;

      totalQuantity += quantity;
      totalPrice += subTotal;

      return {
        ...reportItem,
        subTotal
      };
    });

    return {
      items: formattedItems,
      totalQuantity,
      totalPrice
    };
  } catch (error) {
    console.error('Error getting quotation item by quotation id:', error);
    throw error;
  }
};

export {
  createQuotationItem,
  getQuotationItems,
  getQuotationItemById,
  updateQuotationItem,
  deleteQuotationItem,
  getQuotationItemByQuotationId
};
