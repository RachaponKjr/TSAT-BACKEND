import { Request, Response } from 'express';
import { QuotationReportItemSchema } from '../../types/quotation.type';
import * as itemService from '../../service/quotation/quotation-item.service';

export const createQuotationItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = QuotationReportItemSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }
    const result = await itemService.createQuotationItem(data.data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuotationItemsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await itemService.getQuotationItems();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuotationItemByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await itemService.getQuotationItemById(id);
    if (!result) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuotationItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = QuotationReportItemSchema.partial().safeParse(req.body);
    const { id } = req.params;
    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }
    const result = await itemService.updateQuotationItem(id, data.data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuotationItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await itemService.deleteQuotationItem(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuotationItemByQuotationIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await itemService.getQuotationItemByQuotationId(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
