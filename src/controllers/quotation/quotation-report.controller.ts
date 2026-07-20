/* eslint-disable no-console */
import { Request, Response } from 'express';
import { QuotationReportSchema } from '../../types/quotation.type';
import * as reportService from '../../service/quotation/quotation-report.service';

export const createQuotationReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = QuotationReportSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }

    const result = await reportService.createQuotationReport(data.data);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating quotation report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuotationReportsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await reportService.getQuotationReports();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuotationReportByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await reportService.getQuotationReportById(id);
    if (!result) {
      res.status(404).json({ error: 'Quotation report not found' });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuotationReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = QuotationReportSchema.partial().safeParse(req.body);
    const { id } = req.params;

    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }

    const result = await reportService.updateQuotationReport(id, data.data);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating quotation report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuotationReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await reportService.deleteQuotationReport(id);
    res.status(200).json({ message: 'Quotation report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
