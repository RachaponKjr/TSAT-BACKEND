import { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById
} from '../service/Catagory-Product';

const createCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const imageFile = req.file;
    if (!name || !imageFile) {
      res.status(400).json({ message: 'กรุณากรอก name หรือ image ' });
      return;
    }
    const category = await createCategory({ image: imageFile?.filename, name });
    res.status(200).json({ status: 200, data: category });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const getCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await getCategory();
    res.status(200).json({ status: 200, data: category });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const getCategoryByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    const category = await getCategoryById(req.params.id as string);
    res.status(200).json({ status: 200, data: category });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const updateCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'กรุณากรอก name ' });
      return;
    }
    const category = await createCategory(req.body);
    res.status(200).json({ status: 200, data: category });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const deleteCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    await deleteCategory(req.params.id)
      .then(() => {
        return res
          .status(200)
          .json({ status: 200, message: 'ลบข้อมูลเรียบร้อย' });
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Server Error', error });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

export {
  createCategoryController,
  getCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController
};
