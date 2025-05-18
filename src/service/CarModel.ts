import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCarModel = async (data: {
  name: string;
  image: string;
  imageName: string;
}) => {
  const carModel = await db.carModel.create({
    data: {
      name: data.name,
      image: `uploads/carmodel/${data.image}`, // รูปหลัก
      image_name: `uploads/carmodel/${data.imageName}` // รูปชื่อ (โลโก้ หรือชื่อรถ)
    }
  });
  return carModel;
};

const checkCarModel = async (name: string) => {
  const carModel = await db.carModel.findUnique({ where: { name: name } });
  return carModel;
};

const getCarModel = async () => {
  const carModels = await db.carModel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      showActive: true,
      image_name: true,
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
    imageName: model.image_name,
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
      image_name: true,
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
    imageName: carModel.image_name,
    showActive: carModel.showActive,
    carSubModels: carModel.carSubModels,
    categories: carModel.carServiceLinks.map((link) => link.carService.category)
  };
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
