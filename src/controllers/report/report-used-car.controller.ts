/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import {
  ReqOpenReport,
  ReqOpenReportSchema
} from '../../types/reportusedcar.type';
import {
  deleteReport,
  getReportFull,
  openReport,
  updateReport
} from '../../service/report/report-used-car.service';

const openReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqBody = req.body as ReqOpenReport;
    const reportRes = await openReport({ data: reqBody });

    if (!reportRes) {
      throw new Error('Open report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

const updateApproveReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Missing report ID in params' });
      return;
    }

    // 1. นำ Zod Schema ที่มีอยู่มาปรับเป็น .partial() เพื่อให้ใช้กับการอัปเดตแบบบางฟิลด์ได้
    const parseResult = ReqOpenReportSchema.partial().safeParse(req.body);

    // 2. ถ้าข้อมูลที่ส่งมาไม่ตรงตามกฎของ Zod ให้เตือนกลับไปทันที (ไม่หลุดไปถึง Prisma)
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }

    // 3. ส่งข้อมูลที่ผ่านการตรวจสอบแล้ว (Clean Data) ไปอัปเดต
    const reportRes = await updateReport({ data: parseResult.data, id });

    if (!reportRes) {
      throw new Error('Update approve report failed');
    }

    res.status(200).json({ data: reportRes });
    return;
  } catch (error: any) {
    // 4. ปรับแก้ให้ส่ง error.message ออกไป จะได้เห็นบนหน้าจอชัด ๆ ว่า Prisma บ่นเรื่องอะไร
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
      error: error // ส่งก้อนเต็มไปด้วย เผื่อดูรายละเอียดเพิ่ม
    });
    return;
  }
};

const delReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reportRes = await deleteReport({ id });

    if (!reportRes) {
      throw new Error('Delete report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

const getReportFullController = async (req: Request, res: Response) => {
  try {
    const reportRes = await getReportFull();
    if (!reportRes) {
      throw new Error('Get report full failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

export {
  openReportController,
  updateApproveReportController,
  delReportController,
  getReportFullController
};
