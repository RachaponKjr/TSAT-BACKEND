import { Request, Response } from 'express';
import {
  createCustomerWork,
  deleteCustomerWork,
  getBySubCarModel,
  getCustomerWork,
  getCustomerWorks,
  getWithCarModel
} from '../service/customer-work';
import path from 'path';
import { unlink } from 'fs/promises';

type Work = {
  id: string;
  title: string;
  images: string;
  carModel: { name: string };
};

const createWorkController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageFile = req.file;
    const { title, content, tags, carModelId } = req.body;

    if (!imageFile || !title || !tags || !carModelId) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    const parsedTags = JSON.parse(tags);
    const parsedContent = JSON.parse(content);
    const imageUrl = `/uploads/works/${imageFile.filename}`;

    const work = await createCustomerWork({
      input: {
        title,
        content: parsedContent,
        carModelId,
        tags: parsedTags
      },
      images: imageUrl
    });

    res.status(200).json({ status: 200, data: work });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWorksController = async (req: Request, res: Response) => {
  try {
    const data = await getCustomerWorks();
    res.status(200).json({ status: 200, ...data });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getBySubCarModelController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const works = await getBySubCarModel({ carSubModelId: id });
    res.status(200).json({ status: 200, data: works });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWithCarModelController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const works = await getWithCarModel({ carModeId: id });
    res.status(200).json({ status: 200, data: works });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWorkController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const works = await getCustomerWork({ id: id });
    res.status(200).json({ status: 200, data: works });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const deleteWorkController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // 1. ดึงข้อมูลก่อนลบ เพื่อได้ path รูป
    const works = await getCustomerWork({ id });
    console.log('works', works);
    if (!works) {
      res.status(404).json({ status: 404, message: 'ไม่พบข้อมูล' });
      return;
    }

    // 2. ลบไฟล์ภาพ
    if (works.images) {
      const relativePath = works.images.replace(/^\/+/, '');
      const filePath = path.join(process.cwd(), relativePath);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบภาพได้: ${filePath}`, err);
      }
    }

    // 3. ลบข้อมูลจาก DB
    const deleted = await deleteCustomerWork({ id });

    res
      .status(200)
      .json({ status: 200, message: 'ลบข้อมูลและภาพเรียบร้อย', data: deleted });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server Error', error });
  }
};

export {
  createWorkController,
  getWorkController,
  getWorksController,
  deleteWorkController,
  getWithCarModelController,
  getBySubCarModelController
};
