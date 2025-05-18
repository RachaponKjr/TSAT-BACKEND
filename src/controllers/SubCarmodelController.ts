import { Request, Response } from 'express';
import {
  createSubCarModel,
  deleteSubCarModel,
  getSubCarModel,
  getSubCarModelById
} from '../service/SubCarMoelService';
import path from 'path';
import { unlink } from 'fs/promises';

const createSubCarModelController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, carModelId } = req.body;
    const imageFile = req.file;
    if (!name || !carModelId) {
      res
        .status(400)
        .json({ message: 'กรุณากรอกข้อมูลให้ครบ name , carModelId' });
      return;
    }
    const subCarModel = await createSubCarModel({
      name,
      carModelId,
      image: imageFile?.filename || ''
    });
    res.status(200).json({ status: 200, data: subCarModel });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getSubCarModelController = async (req: Request, res: Response) => {
  try {
    const subCarModel = await getSubCarModel();
    res.status(200).json({ status: 200, data: subCarModel });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getSubCarModelByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    const subCarModel = await getSubCarModelById(req.params.id as string);
    res.status(200).json({ status: 200, data: subCarModel });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const deleteSubCarModelController = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }

    const subCarModel = await getSubCarModelById(req.params.id as string);
    if (!subCarModel) {
      res.status(400).json({ message: 'ไม่พบรายการนี้' });
      return;
    }

    if (subCarModel.image) {
      const filePath = path.join(__dirname, '../../', subCarModel.image);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบภาพได้: ${filePath}`, err);
      }
    } // ระบุ path ของไฟล์ที่ต้องการลบ

    await deleteSubCarModel(req.params.id)
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
  createSubCarModelController,
  getSubCarModelController,
  getSubCarModelByIdController,
  deleteSubCarModelController
};
