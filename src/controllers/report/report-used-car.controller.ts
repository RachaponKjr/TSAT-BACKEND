/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import { ReqOpenReport } from '../../types/reportusedcar.type';
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
    const reqBody = req.body as Partial<ReqOpenReport>;
    const { id } = req.params;
    const reportRes = await updateReport({ data: reqBody, id });

    if (!reportRes) {
      throw new Error('Update approve report failed');
    }
    res.status(200).json({ data: reportRes });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
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
