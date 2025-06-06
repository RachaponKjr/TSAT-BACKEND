/* eslint-disable no-console */
import { Request, Response } from 'express';
import {
  checkCarModel,
  createCarModel,
  deleteCarModel,
  getCarModel,
  getCarModelById,
  updateCarModel
} from '../service/CarModel';
import path from 'path';
import { unlink } from 'fs/promises';

const createCarModelController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name }: { name: string } = req.body;

    const files = req.file?.filename;

    console.log(files);

    if (!name || !files) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }

    const carModel = await createCarModel({
      name,
      image: files
    });

    res.status(200).json({ status: 200, data: carModel });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getCarModelController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const carModel = await getCarModel();
    res.status(200).json({ status: 200, data: carModel });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getCarModelByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    const data = await getCarModelById(req.params.id);
    if (data === null) {
      res.status(400).json({ message: 'ไม่พบรายการนี้' });
      return;
    }
    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCarModelController = async (req: Request, res: Response) => {
  try {
    const { name }: { name: string } = req.body;

    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params' });
      return;
    }

    if (!name) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูล name' });
      return;
    }

    const exist = await checkCarModel(req.params.id);
    if (!exist) {
      res.status(404).json({ message: 'ไม่มีรายการนี้อยู่' });
      return;
    }

    const files = req.file?.filename;

    // หากมีรูปใหม่เข้ามา
    let imagePath = exist.image;
    if (files) {
      // ลบรูปเก่า
      const delImage = path.join(__dirname, '../..', exist.image);
      try {
        await unlink(delImage);
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบภาพเก่าได้`, err);
      }

      // สร้าง path ใหม่
      imagePath = `/uploads/carmodel/${files}`;
    }

    const carModel = await updateCarModel({
      id: req.params.id,
      data: {
        name,
        image: imagePath
      }
    });

    res.status(200).json({ status: 200, data: carModel });
    return;
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const deleteCarModelController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({ message: 'ไม่พบรหัสโมเดลรถ' });
      return;
    }

    const carModel = await getCarModelById(id);

    if (!carModel) {
      res.status(404).json({ message: 'ไม่พบข้อมูลโมเดลรถ' });
      return;
    }

    // ถ้ามีรูปภาพแนบมา ลบไฟล์ก่อน (ถ้ามี field เช่น imagePath)
    if (carModel.image) {
      const filePath = path.join(__dirname, '../..', carModel.image);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบภาพได้: ${filePath}`, err);
      }
    }

    // ลบข้อมูลจากฐานข้อมูล
    await deleteCarModel(id);

    res.status(200).json({ status: 200, message: 'ลบข้อมูลเรียบร้อย' });
    return;
  } catch (error) {
    console.error('❌ ลบโมเดลรถผิดพลาด:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error });
    return;
  }
};

export {
  createCarModelController,
  getCarModelController,
  getCarModelByIdController,
  updateCarModelController,
  deleteCarModelController
};
