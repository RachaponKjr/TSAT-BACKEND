import { prisma as db } from '../libs/prisma';

interface CreateWorkInput {
  carModelId?: string;
  carSubModelId?: string;
}

const createWorkService = async ({
  data,
  image
}: {
  data: CreateWorkInput;
  image: string;
}) => {
  if (!data.carModelId || !data.carSubModelId) return;
  const work = await db.workService.create({
    data: {
      image: `uploads/${image}`,
      carModelId: data.carModelId,
      carSubModelId: data.carSubModelId
    }
  });
  return work;
};

const getWorkService = async () => {
  const services = await db.workService.findMany({
    include: {
      carModel: true,
      carSubModel: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return services.map((service) => ({
    id: service.id,
    image: service.image,
    carModel: {
      id: service.carModel.id,
      name: service.carModel.name,
      image: service.carModel.image
    },
    carSubModel: {
      id: service.carSubModel.id,
      name: service.carSubModel.name,
      image: service.carSubModel.image
    }
  }));
};

export { createWorkService, getWorkService };
