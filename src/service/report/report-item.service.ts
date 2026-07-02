import { prisma as db } from '../../libs/prisma';

export interface typeReqCreateItem {
  title: string;
  note?: string;
  image_url?: string;
  reportDetailId: string;
}

const createItemReport = async (payload: typeReqCreateItem) => {
  try {
    const item = await db.reportItem.create({
      data: payload
    });
    return item;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

const updateItemReport = async (payload: typeReqCreateItem, id: string) => {
  try {
    const item = await db.reportItem.update({
      where: {
        id
      },
      data: payload
    });
    return item;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

const deleteItemReport = async (id: string) => {
  try {
    const item = await db.reportItem.delete({
      where: {
        id
      }
    });
    return item;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

const getItemReport = async (id: string) => {
  try {
    const item = await db.reportItem.findUnique({
      where: {
        id
      }
    });
    return item;
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

export { createItemReport, updateItemReport, deleteItemReport, getItemReport };
