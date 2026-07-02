/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import { ReqOpenReport } from '../types/reportusedcar.type';
import { openReport } from '../service/report-used-car.service';

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

export { openReportController };
