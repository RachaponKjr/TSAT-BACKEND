import { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategoryById
} from '../service/Catagory-Product';
import path from 'path';
import { unlink } from 'fs/promises';

const createCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, categoryServiceId } = req.body;
    const imageFile = req.file;
    if (!name || !imageFile) {
      res.status(400).json({ message: 'กรุณากรอก name หรือ image ' });
      return;
    }
    const category = await createCategory({
      image: imageFile?.filename,
      name,
      categoryServiceId
    });
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
    const { id } = req.params;
    const { name, categoryServiceId } = req.body;
    if (!id) {
      res.status(400).json({ message: 'ไม่พบ params' });
      return;
    }
    if (!name) {
      res.status(400).json({ message: 'กรุณากรอก name' });
      return;
    }

    const checkCategory = await getCategoryById(id);
    if (!checkCategory) {
      res.status(404).json({ message: 'ไม่พบ Category' });
      return;
    }

    // ลบไฟล์เก่า ถ้ามีรูปใหม่มาแทน
    if (checkCategory.image && req.file) {
      const relativePath = checkCategory.image.replace(/^\/?public\//, '');
      const filePath = path.join(process.cwd(), 'public', relativePath);

      try {
        await unlink(filePath);
        console.log(`🗑️ ลบไฟล์สำเร็จ: ${filePath}`);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          console.warn(`⚠️ ไฟล์ไม่พบ: ${filePath}`);
        } else {
          console.error(`❌ ลบไฟล์ไม่สำเร็จ: ${filePath}`, err);
        }
      }
    }
    const imagePath = req.file
      ? `/public/products/${req.file.filename}`
      : checkCategory.image.replace(
          /^\/?public\/products\//,
          '/public/products/'
        );

    const payload = {
      name,
      categoryServiceId: categoryServiceId || checkCategory.categoryServiceId,
      image: imagePath
    };

    const category = await updateCategoryById({
      id,
      data: payload
    });

    res.status(200).json({ status: 200, data: category });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(500).json({ message: 'Server Error', error });
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
