import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCarModel = async (data: { name: string; image: string }) => {
  const carModel = await db.carModel.create({
    data: {
      name: data.name,
      image: `/uploads/carmodel/${data.image}` // รูปหลัก
    }
  });
  return carModel;
};

const checkCarModel = async (id: string) => {
  const carModel = await db.carModel.findUnique({ where: { id: id } });
  return carModel;
};

const getCarModel = async () => {
  const carModels = await db.carModel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      showActive: true,
      carSubModels: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  const categoryService = await db.categoryService.findMany({
    select: {
      title: true
    }
  });

  // map แปลง format
  return carModels.map((model) => ({
    id: model.id,
    name: model.name,
    image: model.image,
    showActive: model.showActive,
    carSubModels: model.carSubModels,
    categoryService: categoryService.map((service) => service.title)
  }));
};

const getCarModelById = async (id: string) => {
  const carModel = await db.carModel.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      showActive: true,
      carSubModels: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      carServiceLinks: {
        select: {
          carService: {
            select: {
              category: true
            }
          }
        }
      }
    }
  });

  if (!carModel) return null;

  return {
    id: carModel.id,
    name: carModel.name,
    image: carModel.image,
    showActive: carModel.showActive,
    carSubModels: carModel.carSubModels,
    categories: carModel.carServiceLinks.map((link) => link.carService.category)
  };
};

const updateCarModel = async ({
  id,
  data
}: {
  id: string;
  data: { name: string; image: string };
}) => {
  const carModel = await db.carModel.update({
    where: { id },
    data: {
      name: data.name,
      image: `/uploads/carmodel/${data.image}`
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
