import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

interface Product {
  name: string;
  detail: string;
  categoryId: string;
  imageProduct: string;
}
const createProduct = async (data: Product) => {
  const product = await db.product.create({ data: data });
  return product;
};

const getProduct = async () => {
  const product = await db.product.findMany();
  return product;
};

const getProductById = async (id: string) => {
  const product = await db.product.findUnique({ where: { id: id } });
  return product;
};

const deleteProduct = async (id: string) => {
  const product = await db.product.delete({ where: { id: id } });
  return product;
};

const updateProduct = async (id: string, data: Product) => {
  const product = await db.product.update({ where: { id: id }, data: data });
  return product;
};

export {
  createProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct
};
