import { Request, Response } from 'express';
import {
  createSubCarModel,
  deleteSubCarModel,
  getSubCarModel,
  getSubCarModelById
} from '../service/SubCarMoelService';

const createSubCarModelController = async (
  req: Request<{ name: string; carModelId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { name, carModelId } = req.body;
    if (!name || !carModelId) {
      res
        .status(400)
        .json({ message: 'กรุณากรอกข้อมูลให้ครบ name , carModelId' });
      return;
    }
    const subCarModel = await createSubCarModel({ name, carModelId });
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
