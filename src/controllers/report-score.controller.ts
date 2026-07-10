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
    // 🟢 เปลี่ยนมารับค่าทั้งหมดผ่าน req.body ตามที่หน้าบ้านยิงมา
    const {
      criteriaResultId,
      itemResultId,
      criteriaId,
      optionId,
      categoryResultId,
      itemId
    } = req.body;

    // บังคับเช็คข้อมูลที่จำเป็นสำหรับการ Upsert (กรณีไม่มี criteriaResultId ต้องมี itemResultId และ criteriaId มาแทน)
    if (!optionId || (!criteriaResultId && (!itemResultId || !criteriaId))) {
      res.status(400).json({
        message:
          'Missing required parameters (optionId, itemResultId, or criteriaId)'
      });
      return;
    }

    // ส่งข้อมูลทั้งหมดเข้าไปที่ Service
    const result = await selectScoreOption({
      criteriaResultId: criteriaResultId || null,
      itemResultId,
      categoryResultId,
      itemId,
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
