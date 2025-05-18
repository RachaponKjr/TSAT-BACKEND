import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createServiceService = async (data: {
  serviceDetail: string;
  serviceName: string;
  explain: string;
  title: string;
  icon: string;
  image: string[];
}) => {
  const imagePaths = data.image.map((img) => `/uploads/${img}`);
  const service = await db.service.create({
    data: {
      serviceName: data.serviceName,
      serviceDetail: data.serviceDetail,
      explain: data.explain,
      title: data.title,
      icon: data.icon,
      images: imagePaths
    }
  });

  return service;
};

const get_Service = async () => {
  const service = await db.service.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });
  return service;
};

const updateService = async (id: string, data: any) => {
  const service = await db.service.update({
    where: { id },
    data
  });
  return service;
};

const deleteService = async (id: string) => {
  const service = await db.service.delete({ where: { id: id } });
  return service;
};

export { createServiceService, get_Service, updateService, deleteService };
