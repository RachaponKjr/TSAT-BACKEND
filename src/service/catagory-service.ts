import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

interface CatagoryService {
  title: string;
}

const createCatagoryService = async (data: CatagoryService) => {
  const catagoryService = await db.categoryService.create({
    data: {
      title: data.title
    }
  });
  return catagoryService;
};

const getCatagoryService = async () => {
  const catagoryService = await db.categoryService.findMany();
  return catagoryService;
};

export { createCatagoryService, getCatagoryService };
