import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export interface SubServiceReq {
  serviceId: string;
  subServiceName: string;
  subServiceDetail: string;
}

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
    },
    include: {
      subService: {
        select: {
          id: true,
          subServiceName: true
        }
      }
    }
  });
  return service;
};

const get_serive_id = async (id: string) => {
  const serviceById = await db.service.findUnique({
    where: { id }
  });
  return serviceById;
};

const updateService = async (id: string, data: any) => {
  const subServices = data.subService?.map((s: any) => ({ id: s.id })) || [];

  const service = await db.service.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
      subService: {
        connect: subServices
      }
    }
  });
  return service;
};

const deleteService = async (id: string) => {
  const service = await db.service.delete({ where: { id: id } });
  return service;
};

const createSubService = async (data: SubServiceReq) => {
  const subService = await db.subService.create({
    data: {
      serviceId: data.serviceId,
      subServiceName: data.subServiceName,
      subServiceDetail: data.subServiceDetail
    }
  });
  return subService;
};

const delSucService = async (id: string) => {
  const delsub = await db.subService.delete({
    where: {
      id: id
    }
  });
  return delsub;
};

const getSubservice = async (id: string) => {
  const subservice = await db.subService.findMany({
    where: {
      serviceId: id
    }
  });
  return subservice;
};

export {
  createServiceService,
  get_Service,
  get_serive_id,
  updateService,
  deleteService,
  createSubService,
  delSucService,
  getSubservice
};
