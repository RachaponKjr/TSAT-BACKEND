import { Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct
} from '../service/ProductService';
import { unlink } from 'fs/promises';
import path from 'path';

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, detail, categoryId } = req.body;
    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }
    const image_product = `/public/products/${req.file.filename}`;

    if (!name || !detail || !categoryId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const product = await createProduct({
      categoryId,
      name,
      detail,
      imageProduct: image_product
    });

    res.status(201).json({ status: 201, data: product });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getProductController = async (req: Request, res: Response) => {
  try {
    const product = await getProduct();
    res.status(200).json({ status: 200, data: product });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id as string);
    res.status(200).json({ status: 200, data: product });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id as string, req.body);
    res.status(200).json({ status: 200, data: product });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ message: 'ไม่พบข้อมูลสินค้า' });
      return;
    }

    // ลบไฟล์ภาพ
    if (product.imageProduct) {
      const relativePath = product.imageProduct.replace(/^\/?public\//, '');
      const filePath = path.join(process.cwd(), 'public', relativePath);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบภาพได้: ${filePath}`, err);
      }
    }

    // ลบสินค้าในฐานข้อมูล
    await db.product.delete({ where: { id } });

    res.status(200).json({ status: 200, message: 'ลบสินค้าสำเร็จ' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

export {
  createProductController,
  getProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController
};
