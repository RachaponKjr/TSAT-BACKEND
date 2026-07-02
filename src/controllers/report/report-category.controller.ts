import { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  getReportList,
  getReportListById,
  typeReqCreateCategory,
  updateCategory
} from '../../service/report/report-category.service';

const createCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, icon_url, reportId } = req.body as typeReqCreateCategory;
    if (!title || !icon_url || !reportId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const categoryRes = await createCategory({ title, icon_url, reportId });
    res.status(200).json({ data: categoryRes });
    return;
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const getReportListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportList = await getReportList();
    res.status(200).json({ data: reportList });
    return;
  } catch (error) {
    console.error('Error getting report list:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const getReportListByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const reportList = await getReportListById(id);
    res.status(200).json({ data: reportList });
    return;
  } catch (error) {
    console.error('Error getting report list:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const updateCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, icon_url, reportId } =
      req.body as Partial<typeReqCreateCategory>;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const payload = {
      title,
      icon_url,
      reportId
    };
    const categoryRes = await updateCategory(payload, id);
    res.status(200).json({ data: categoryRes });
    return;
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: error });
    return;
  }
};

const deleteCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const categoryRes = await deleteCategory(id);
    res.status(200).json({ data: categoryRes });
    return;
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error });
    return;
  }
};

export {
  createCategoryController,
  getReportListController,
  getReportListByIdController,
  updateCategoryController,
  deleteCategoryController
};
