import { Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct
} from '../service/ProductService';

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
    const image_product = `/product/img/${req.file.filename}`;

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
    await deleteProduct(req.params.id as string)
      .then(() => {
        res.status(200).json({ status: 200, message: 'ลบข้อมูลเรียบร้อย' });
        return;
      })
      .catch((error) => {
        res.status(500).json({ message: 'ไม่พบข้อมูล', error });
        return;
      });
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
