import { Request, Response } from 'express';
import { createServiceService, get_Service } from '../service/Service';

const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceName, serviceDetail, title, explain, icon } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!serviceName || !serviceDetail || !files || files.length === 0) {
      res.status(400).json({
        message: 'กรุณากรอกข้อมูลให้ครบ และอัปโหลดรูปอย่างน้อย 1 รูป'
      });
      return;
    }

    // ดึงเฉพาะชื่อไฟล์ (หรือ path) มาเก็บ
    const imageFilenames = files.map((file) => file.filename);

    const service = await createServiceService({
      serviceName,
      serviceDetail,
      title,
      explain,
      icon,
      image: imageFilenames
    });

    res.status(201).json({ message: 'สร้างบริการสำเร็จ', data: service });
  } catch (error) {
    res.status(500).json({ message: 'Server Error!', error });
  }
};

const getService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await get_Service();
    res.status(200).json({ status: 200, service });
  } catch (error) {
    res.status(500).json({ message: 'Server Error!', error });
  }
};

export { createService, getService };
