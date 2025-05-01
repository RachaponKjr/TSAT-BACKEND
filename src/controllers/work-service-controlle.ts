import { Request, Response } from 'express';
import { createWorkService, getWorkService } from '../service/work-service';

const WorkServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { carModelId, subCarModelId } = req.body;
    const image = req.file as Express.Multer.File;

    if (!carModelId || !subCarModelId || !image) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    const workservice = await createWorkService({
      data: { carModelId, carSubModelId: subCarModelId },
      image: image.filename
    });

    if (!workservice) {
      res.status(400).json({ message: 'ไม่สามารถสร้างข้อมูลได้' });
    }

    res.status(200).json({ status: 200, data: workservice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWorkServiceController = async (req: Request, res: Response) => {
  try {
    const workservice = await getWorkService();
    res.status(200).json({ status: 200, data: workservice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export { WorkServiceController, getWorkServiceController };
