import { Request, Response } from 'express';
import {
  createScoreReport,
  deleteScoreReport,
  getScoreReportList,
  updateScoreReport
} from '../../service/report/report-score.service';

interface TypeReqCreateReportScore {
  title: string;
  score: number;
  description?: string;
  reportItemId: string;
}

const createScoreReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as TypeReqCreateReportScore;
    const score = await createScoreReport(payload);
    res.status(200).json({ data: score });
    return;
  } catch (error) {
    console.error('Error creating score report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const deleteScoreReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const score = await deleteScoreReport(id);
    res.status(200).json({ data: score });
    return;
  } catch (error) {
    console.error('Error deleting score report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const updateScoreReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payload = req.body as Partial<TypeReqCreateReportScore>;
    const score = await updateScoreReport(payload, id);
    res.status(200).json({ data: score });
    return;
  } catch (error) {
    console.error('Error updating score report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const getScoreReportListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const score = await getScoreReportList();
    res.status(200).json({ data: score });
    return;
  } catch (error) {
    console.error('Error getting score report list:', error);
    res.status(500).json({ message: error });
    return;
  }
};

export {
  createScoreReportController,
  deleteScoreReportController,
  updateScoreReportController,
  getScoreReportListController
};
