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
    throw error;
  }
};

const getQuotationReports = async () => {
  try {
    return await db.quotationReport.findMany({
      include: { items: true, references: true }
    });
  } catch (error) {
    console.error('Error getting quotation reports:', error);
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
    throw error;
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
    throw error;
  }
};

const deleteQuotationReport = async (id: string) => {
  try {
    return await db.quotationReport.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting quotation report:', error);
    throw error;
  }
};

export {
  createQuotationReport,
  getQuotationReports,
  getQuotationReportById,
  updateQuotationReport,
  deleteQuotationReport
};
