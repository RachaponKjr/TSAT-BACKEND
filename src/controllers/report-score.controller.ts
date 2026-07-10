/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import { ReqUpdateCriteriaResultSchema } from '../types/reportInspection.type';
import {
  getScoreReportList,
  selectScoreOption,
  updateScoreReport
} from '../service/report-score.service';

const updateScoreReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing criteriaResult ID in params' });
      return;
    }
    const parseResult = ReqUpdateCriteriaResultSchema.partial().safeParse(
      req.body
    );
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateScoreReport({
      data: parseResult.data as any,
      id
    });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const selectScoreOptionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      criteriaResultId,
      itemResultId,
      criteriaId,
      optionId,
      categoryResultId,
      itemId
    } = req.body;

    // 1. ตรวจสอบเบื้องต้นว่าต้องส่ง optionId และ criteriaId มาเสมอ
    if (!optionId || !criteriaId) {
      res.status(400).json({ message: 'Missing criteriaId or optionId' });
      return;
    }

    // 2. 🟢 เงื่อนไขใหม่: ถ้าไม่มีทั้ง criteriaResultId และ itemResultId (เคสข้อตรวจคะแนน 0)
    // จำเป็นต้องมี categoryResultId และ itemId ส่งมาด้วยเพื่อนำไปสร้างแถวข้อมูลใหม่
    if (!criteriaResultId && !itemResultId) {
      if (!categoryResultId || !itemId) {
        res.status(400).json({
          message:
            'Missing categoryResultId or itemId for initializing new item result'
        });
        return;
      }
    }

    // ส่งข้อมูลทั้งหมดเข้าไปที่ Service (ปรับลอจิกแปลงค่าว่างให้เป็น null หรือ string เปล่าให้เคลียร์)
    const result = await selectScoreOption({
      criteriaResultId: criteriaResultId || null,
      itemResultId: itemResultId || null, // 🟢 เผื่อหน้าบ้านส่ง "" มา ให้แปลงเป็น null
      categoryResultId: categoryResultId || '',
      itemId: itemId || '',
      criteriaId,
      optionId
    });

    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const getScoreReportListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemResultId } = req.query;
    if (!itemResultId || typeof itemResultId !== 'string') {
      res.status(400).json({ message: 'Missing itemResultId query param' });
      return;
    }
    const list = await getScoreReportList({ itemResultId });
    res.status(200).json({ data: list });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

export {
  updateScoreReportController,
  selectScoreOptionController,
  getScoreReportListController
};
