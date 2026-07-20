/* eslint-disable no-console */
import { prisma as db } from '../../libs/prisma';
import { ReqOpenQuotationReportItem } from '../../types/quotation.type';

const createQuotationItem = async (data: ReqOpenQuotationReportItem) => {
  try {
    return await db.quotationReportItem.create({ data });
  } catch (error) {
    console.error('Error creating quotation item:', error);
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

export {
  createQuotationItem,
  getQuotationItems,
  getQuotationItemById,
  updateQuotationItem,
  deleteQuotationItem
};
