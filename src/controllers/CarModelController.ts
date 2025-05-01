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

const updateCarModelController = async (
  req: Request<{ name: string; showActive: boolean; id: string }>,
  res: Response
) => {
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
    if (!req.params.id) {
      res.status(400).json({ message: 'ไม่พบ params ' });
      return;
    }
    await deleteCarModel(req.params.id)
      .then(() => {
        res.status(200).json({ status: 200, message: 'ลบข้อมูลเรียบร้อย' });
        return;
      })
      .catch((error) =>
        res.status(500).json({ message: 'Server Error', error })
      );
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
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
