import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCategory = async (data: { name: string }) => {
  const category = await db.category.create({
    data: {
      name: data.name
    }
  });
  return category;
};

const getCategory = async () => {
  const category = await db.category.findMany();
  return category;
};

const getCategoryById = async (id: string) => {
  const category = await db.category.findUnique({
    where: { id: id },
    include: { products: true }
  });
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await db.category.delete({ where: { id: id } });
  return category;
};

const updateCategory = async (id: string, data: { name: string }) => {
  const category = await db.category.update({
    where: { id: id },
    data: {
      name: data.name
    }
  });
  return category;
};

export {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getCategoryById
};
