import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCarModel = async (data: { name: string }) => {
  const carModel = await db.carModel.create({
    data: {
      name: data.name
    }
  });
  return carModel;
};

const checkCarModel = async (name: string) => {
  const carModel = await db.carModel.findUnique({ where: { name: name } });
  return carModel;
};

const getCarModel = async () => {
  const carModel = await db.carModel.findMany();
  return carModel;
};

const getCarModelById = async (id: string) => {
  const carModel = await db.carModel.findUnique({
    where: { id: id },
    include: { carSubModels: true }
  });
  return carModel;
};

const updateCarModel = async (
  id: string,
  data: { name: string; showActive: boolean }
) => {
  const carModel = await db.carModel.update({
    where: { id: id },
    data: {
      name: data.name,
      showActive: data.showActive
    }
  });
  return carModel;
};

const deleteCarModel = async (id: string) => {
  const carModel = await db.carModel.delete({ where: { id: id } });
  return carModel;
};

export {
  createCarModel,
  getCarModel,
  getCarModelById,
  updateCarModel,
  deleteCarModel,
  checkCarModel
};
