import { prisma as db } from '../../libs/prisma';
import { Request, Response } from 'express';
import {
  createMainReport,
  deleteMainReport,
  getReportMainList,
  updateMainReport
} from '../../service/report/report-main.service';

export interface TypeReqCreateReportMain {
  car_url: string;
  inspector?: string;
  approver?: string;
  overallGrade?: string;
  totalScore?: number;
  maxScore?: number;
}

const createReportMainController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as TypeReqCreateReportMain;
    if (!payload.car_url) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const reportRes = await createMainReport(payload);
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    console.error('Error opening report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const getReportMainListController = async (req: Request, res: Response) => {
  try {
    const reportRes = await getReportMainList();
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    console.error('Error getting report list:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const updateReportMainController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as Partial<TypeReqCreateReportMain>;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const reportRes = await updateMainReport(
      payload as TypeReqCreateReportMain,
      id
    );
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const deleteReportMainController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const reportRes = await deleteMainReport(id);
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: error });
    return;
  }
};

export {
  createReportMainController,
  getReportMainListController,
  updateReportMainController,
  deleteReportMainController
};
