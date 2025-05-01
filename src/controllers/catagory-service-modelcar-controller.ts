import { Request, Response } from 'express';
import {
  createCatagoryServiceModel,
  createServiceModel
} from '../service/catagory-service-modelcar';

const categoryServiceModelCar = async (req: Request, res: Response) => {
  const { category } = req.body;
  if (!category) {
    res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    return;
  }
  const categoryservice = await createCatagoryServiceModel({ category });

  res.status(200).json({ status: 200, data: categoryservice });
};

const createCatagoryService = async (req: Request, res: Response) => {
  try {
    const { carServiceId, carModelId } = req.body;
    if (!carServiceId || !carModelId) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }
    const categoryservice = await createServiceModel({
      carModelId,
      carServiceId
    });
    res.status(200).json({ status: 200, data: categoryservice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export { categoryServiceModelCar, createCatagoryService };
