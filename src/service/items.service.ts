/* eslint-disable no-console */
import { TItemReq } from '../types/items.type';
import { prisma as db } from '../libs/prisma';

const createItems = async ({ data }: { data: TItemReq }) => {
  try {
    const res = await db.items.create({
      data
    });
    return res;
  } catch (error) {
    console.log('createItems error', error);
    throw error;
  }
};

const getItemList = async (params?: { search?: string }) => {
  try {
    const search = params?.search?.trim();
    const whereCondition = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const
              }
            }
          ]
        }
      : {};

    const res = await db.items.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res;
  } catch (error) {
    console.log('getItemList error', error);
    throw error;
  }
};

const getItemById = async ({ id }: { id: string }) => {
  try {
    const res = await db.items.findUnique({
      where: { id }
    });
    return res;
  } catch (error) {
    console.log('getItemById error', error);
    throw error;
  }
};

const updateItem = async ({ data, id }: { data: TItemReq; id: string }) => {
  try {
    const res = await db.items.update({
      where: { id },
      data
    });
    return res;
  } catch (error) {
    console.log('updateItem error', error);
    throw error;
  }
};

const deleteItem = async ({ id }: { id: string }) => {
  try {
    const res = await db.items.delete({
      where: { id }
    });
    return res;
  } catch (error) {
    console.log('deleteItem error', error);
    throw error;
  }
};

export { createItems, getItemList, updateItem, deleteItem, getItemById };
