import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createSubCarModel = async (data: {
  name: string;
  carModelId: string;
}) => {
  const subCarModel = await db.carSubModel.create({
    data: {
      name: data.name,
      carModelId: data.carModelId
    }
  });
  return subCarModel;
};

const getSubCarModel = async () => {
  const subCarModel = await db.carSubModel.findMany({});
  return subCarModel;
};
const getSubCarModelById = async (id: string) => {
  const subCarModel = await db.carSubModel.findUnique({
    where: { id: id },
    include: { carServices: true }
  });
  return subCarModel;
};

const deleteSubCarModel = async (id: string) => {
  const subCarModel = await db.carSubModel.delete({ where: { id: id } });
  return subCarModel;
};

export {
  createSubCarModel,
  getSubCarModel,
  getSubCarModelById,
  deleteSubCarModel
};
