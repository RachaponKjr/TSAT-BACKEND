import { Request, Response } from 'express';
import { ItemReqSchema } from '../types/items.type';
import {
  createItems,
  deleteItem,
  getItemById,
  getItemList,
  updateItem
} from '../service/items.service';

const createItemsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = ItemReqSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const items = await createItems({ data: parseResult.data });
    res.status(200).json({ items });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const getItemListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search as string;
    const items = await getItemList({ search });
    res.status(200).json({ items });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const getItemByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: { id: 'Id is required' }
      });
      return;
    }
    const items = await getItemById({ id });
    res.status(200).json({ items });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const updateItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: { id: 'Id is required' }
      });
      return;
    }
    const parseResult = ItemReqSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const items = await updateItem({ data: parseResult.data, id });
    res.status(200).json({ items });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const deleteItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: { id: 'Id is required' }
      });
      return;
    }
    const items = await deleteItem({ id });
    res.status(200).json({ items });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

export {
  createItemsController,
  getItemListController,
  updateItemController,
  deleteItemController,
  getItemByIdController
};
