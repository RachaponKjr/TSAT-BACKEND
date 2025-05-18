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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const imageModel = files['image_model']?.[0];
    const imageName = files['image_name']?.[0];

    if (!name || !imageModel || !imageName) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }

    const exist = await checkCarModel(name);
    if (exist) {
      res.status(400).json({ message: 'มีรายการนี้อยู่แล้ว' });
      return;
    }

    const carModel = await createCarModel({
      name,
      image: imageModel.filename,
      imageName: imageName.filename
    });

    res.status(200).json({ status: 200, data: carModel });
    return;
  } catch (error) {
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
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    if (!req.body) {
      res
        .status(400)
        .json({ message: 'กรุณากรอกข้อมูล name หรือ showActive ' });
      return;
    }
    if (name) {
      const exist = await checkCarModel(name);
      if (exist) {
        res.status(400).json({ message: 'มีรายการนี้อยู่แล้ว' });
        return;
      }
    }
    const carModel = await updateCarModel(req.params.id, req.body);
    res.status(200).json({ status: 200, data: carModel });
    return;
  } catch (error) {
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
    if (carModel.image && carModel.imageName) {
      const filePath = path.join(__dirname, '../../', carModel.image);
      const filePath2 = path.join(__dirname, '../../', carModel.imageName);
      try {
        await unlink(filePath);
        await unlink(filePath2);
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
