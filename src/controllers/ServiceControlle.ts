import { Request, Response } from 'express';
import {
  createServiceService,
  deleteService,
  get_Service,
  updateService
} from '../service/Service';
import path from 'path';
import fs from 'fs/promises';

const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceName, serviceDetail, title, explain, icon } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!serviceName || !files || files.length === 0) {
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

const updateServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id) {
      res.status(400).json({ message: 'กรุณาระบุรหัสบริการ' });
      return;
    }

    if (!body || Object.keys(body).length === 0) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    // ตรวจสอบว่าบริการนี้มีอยู่จริงหรือไม่
    const checkId = await get_Service(); // แนะนำให้มี get_ServiceById(id) แทน
    const existingService = checkId.find((item) => item.id === id);

    if (!existingService) {
      res.status(404).json({ message: 'ไม่พบข้อมูลบริการที่ต้องการแก้ไข' });
      return;
    }

    // ทำการอัปเดต
    const updated = await updateService(id, body);

    res.status(200).json({ message: 'แก้ไขบริการสำเร็จ', data: updated });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดของระบบ', error });
  }
};

const deleteServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'กรุณาระบุรหัสบริการ' });
      return;
    }

    // ตรวจสอบว่าบริการนี้มีอยู่จริงหรือไม่
    const checkId = await get_Service();
    const existingService = checkId.find((item) => item.id === id);

    if (!existingService) {
      res.status(404).json({ message: 'ไม่พบข้อมูลบริการที่ต้องการลบ' });
      return;
    }

    // ลบไฟล์รูปภาพจากระบบ
    const imagePaths: string[] = existingService.images ?? [];

    for (const imagePath of imagePaths) {
      const fullPath = path.join(__dirname, '../..', imagePath); // ปรับ path ตามโครงสร้างของโปรเจกต์
      try {
        await fs.unlink(fullPath);
        console.log(`Deleted image: ${fullPath}`);
      } catch (err) {
        console.warn(`ไม่สามารถลบรูปภาพ: ${fullPath}`, err);
      }
    }

    // ทำการลบบริการจากฐานข้อมูล
    await deleteService(id);

    res.status(200).json({ message: 'ลบบริการและรูปภาพสำเร็จ' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดของระบบ', error });
  }
};

export {
  createService,
  getService,
  updateServiceController,
  deleteServiceController
};
