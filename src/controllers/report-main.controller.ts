/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import {
  ReqOpenReport,
  ReqOpenReportSchema
} from '../types/reportInspection.type';
import {
  deleteReport,
  getReportById,
  getReportFull,
  getReportList,
  openReport,
  updateReport
} from '../service/report-main.service';

const openReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = ReqOpenReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const reportRes = await openReport({ data: parseResult.data });
    if (!reportRes) {
      throw new Error('Open report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const updateReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing report ID in params' });
      return;
    }
    const parseResult = ReqOpenReportSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const reportRes = await updateReport({ data: parseResult.data, id });
    if (!reportRes) {
      throw new Error('Update report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const delReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const reportRes = await deleteReport({ id });
    if (!reportRes) {
      throw new Error('Delete report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const getReportFullController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportRes = await getReportFull();
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

const getReportListController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportRes = await getReportList();
    res.status(200).json(reportRes);
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

const getReportByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const reportRes = await getReportById({ id });
    if (!reportRes) {
      res.status(404).json({ message: 'Report not found' });
      return;
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
  updateReportController,
  delReportController,
  getReportFullController,
  getReportByIdController,
  getReportListController
};
