/* eslint-disable no-console */
import { prisma as db } from '../../libs/prisma';
import { ReqReferences } from '../../types/quotation.type';

const createReference = async (data: ReqReferences) => {
  try {
    return await db.references.create({ data });
  } catch (error) {
    console.error('Error creating reference:', error);
    return false;
  }
};

const getReferences = async () => {
  try {
    return await db.references.findMany();
  } catch (error) {
    console.error('Error getting references:', error);
    return false;
  }
};

const getReferenceById = async (id: string) => {
  try {
    return await db.references.findUnique({ where: { id } });
  } catch (error) {
    console.error('Error getting reference by id:', error);
    return false;
  }
};

const updateReference = async (id: string, data: Partial<ReqReferences>) => {
  try {
    return await db.references.update({ where: { id }, data });
  } catch (error) {
    console.error('Error updating reference:', error);
    return false;
  }
};

const deleteReference = async (id: string) => {
  try {
    return await db.references.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting reference:', error);
    return false;
  }
};

export {
  createReference,
  getReferences,
  getReferenceById,
  updateReference,
  deleteReference
};
