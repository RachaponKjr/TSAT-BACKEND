import { Response, Request } from 'express';
import { ReqUpdateItemResultSchema } from '../types/reportInspection.type';
import {
  getItemReport,
  updateItemReport
} from '../service/report-item.service';

const getItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryResultId } = req.query;
    if (!categoryResultId || typeof categoryResultId !== 'string') {
      res.status(400).json({ message: 'Missing categoryResultId query param' });
      return;
    }
    const list = await getItemReport({ categoryResultId });
    res.status(200).json({ data: list });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const updateItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateItemResultSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateItemReport({ data: parseResult.data, id });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

export { getItemReportController, updateItemReportController };
