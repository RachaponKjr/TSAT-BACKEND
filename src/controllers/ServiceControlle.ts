import { Request, Response } from 'express';
import {
  createServiceService,
  createSubService,
  deleteService,
  delSucService,
  get_serive_id,
  get_Service,
  getSubservice,
  getSubServices,
  updateService
} from '../service/Service';
import path from 'path';
import fs from 'fs/promises';

const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceName, serviceDetail, title, explain, bgIcon, icon } =
      req.body;
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
      bgIcon,
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
    const files = req.files as Express.Multer.File[];
    if (!id) {
      res.status(400).json({ message: 'กรุณาระบุรหัสบริการ' });
      return;
    }

    // ตรวจสอบว่าบริการนี้มีอยู่จริงหรือไม่
    const checkId = await get_Service(); // แนะนำให้มี get_ServiceById(id) แทน
    const existingService = checkId.find((item) => item.id === id);

    if (!existingService) {
      res.status(404).json({ message: 'ไม่พบข้อมูลบริการที่ต้องการแก้ไข' });
      return;
    }
    const imageFilenames = files.map((file) => `/uploads/${file.filename}`);

    const payload = {
      ...req.body,
      image: files ? imageFilenames : undefined
    };

    // ทำการอัปเดต
    const updated = await updateService(id, payload);

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

const createSubServiceControlle = async (req: Request, res: Response) => {
  try {
    const { serviceId, subServiceName, subServiceDetail } = req.body;
    const dataReq = {
      serviceId,
      subServiceDetail,
      subServiceName
    };

    if (!serviceId || !subServiceName) {
      res.status(400).json({ message: 'กรุณากรอบ serviceId หรือ serviceName' });
      return;
    }

    const checkSerivce = await get_serive_id(serviceId);

    if (!checkSerivce) {
      res.status(400).json({ message: 'ไม่พบ service' });
      return;
    }

    const createDb = await createSubService(dataReq);
    if (createDb) {
      res.status(201).json({ data: createDb, message: 'สร้างสำเร็จ' });
      return;
    }
  } catch {
    console.log('Err Server');
    return;
  }
};

const getSubServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'ไม่พบ ID นี้' });
      return;
    }
    const subService = await getSubservice(id);
    res.status(200).json({ message: 'ok', subService });
    return;
  } catch {
    console.log('server error');
  }
};

const getSubServicesController = async (req: Request, res: Response) => {
  try {
    const subService = await getSubServices();
    res.status(200).json({
      message: 'เรียกดูบริการย่อยสำเร็จ',
      data: subService
    });
    return;
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    });
    return;
  }
};

const delSubServiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'กรุณา ส่ง id' });
      return;
    }
    await delSucService(id)
      .then(() => {
        res.status(200).json({ message: 'del Ok!' });
        return;
      })
      .catch(() => {
        res.status(404).json({ message: 'Not Fount Id Subservice' });
        return;
      });
  } catch (e) {
    console.log(e, 'Server Error');
    return;
  }
};

export {
  createService,
  getService,
  updateServiceController,
  deleteServiceController,
  createSubServiceControlle,
  delSubServiceController,
  getSubServiceById,
  getSubServicesController
};
