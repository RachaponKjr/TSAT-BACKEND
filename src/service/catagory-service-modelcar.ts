import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

type CatagoryServiceModel = {
  category: string;
};

type CreateServiceModel = {
  carServiceId: string;
  carModelId: string;
};

const createCatagoryServiceModel = async (data: CatagoryServiceModel) => {
  const catagoryServiceModel = await db.categoryServiceCarModel.create({
    data: {
      category: data.category
    }
  });
  return catagoryServiceModel;
};

const createServiceModel = async (data: CreateServiceModel) => {
  const serviceModel = await db.carServiceLink.create({
    data: {
      carServiceId: data.carServiceId,
      carModelId: data.carModelId
    }
  });
  return serviceModel;
};

export { createCatagoryServiceModel, createServiceModel };
