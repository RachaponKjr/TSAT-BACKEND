import {
  createItemReport,
  deleteItemReport,
  getItemReport,
  typeReqCreateItem,
  updateItemReport
} from '../../service/report/report-item.service';
import { Response, Request } from 'express';

const createItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as typeReqCreateItem;
    if (!payload.title || !payload.reportDetailId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const item = await createItemReport(payload);
    res.status(200).json({ data: item });
    return;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

const updateItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as Partial<typeReqCreateItem>;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const item = await updateItemReport(payload as typeReqCreateItem, id);
    res.status(200).json({ data: item });
    return;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

const deleteItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const item = await deleteItemReport(id);
    res.status(200).json({ data: item });
    return;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

const getItemReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await getItemReport();
    res.status(200).json({ data: item });
    return;
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

export {
  createItemReportController,
  updateItemReportController,
  deleteItemReportController,
  getItemReportController
};
