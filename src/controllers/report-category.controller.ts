import { Response, Request } from 'express';
import {
  getReportCategoryById,
  getReportCategoryList
} from '../service/report-category.service';

const getReportCategoryListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reportId } = req.query;
    if (!reportId || typeof reportId !== 'string') {
      res.status(400).json({ message: 'Missing reportId query param' });
      return;
    }
    const list = await getReportCategoryList({ reportId });
    res.status(200).json({ data: list });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const getReportCategoryByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await getReportCategoryById({ id });
    if (!category) {
      res.status(404).json({ message: 'Category result not found' });
      return;
    }
    res.status(200).json({ data: category });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

export { getReportCategoryListController, getReportCategoryByIdController };
