import { prisma as db } from '../../libs/prisma';

export interface typeReqCreateCategory {
  title: string;
  icon_url: string;
  reportId: string;
}

const createCategory = async (data: typeReqCreateCategory) => {
  try {
    const category = await db.reportDetail.create({
      data
    });
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

const getReportList = async () => {
  try {
    const reportList = await db.reportDetail.findMany();
    return reportList;
  } catch (error) {
    console.error('Error getting report list:', error);
    throw error;
  }
};

const getReportListById = async (id: string) => {
  try {
    const reportList = await db.reportDetail.findMany({
      where: {
        id: id
      }
    });
    return reportList;
  } catch (error) {
    console.error('Error getting report list:', error);
    throw error;
  }
};

const updateCategory = async (
  data: Partial<typeReqCreateCategory>,
  id: string
) => {
  try {
    const category = await db.reportDetail.update({
      where: {
        id: id
      },
      data
    });
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

const deleteCategory = async (id: string) => {
  try {
    const category = await db.reportDetail.delete({
      where: {
        id: id
      }
    });
    return category;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export {
  createCategory,
  getReportList,
  getReportListById,
  updateCategory,
  deleteCategory
};
