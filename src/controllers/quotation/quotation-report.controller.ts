/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { QuotationReportSchema } from '../../types/quotation.type';
import * as reportService from '../../service/quotation/quotation-report.service';
import {
  generateQuotationPaper,
  IQuotation
} from '../../template/quotation-paper';
import { generatePdfFromTemplate } from '../../service/main-pdf.service';
import { deletePdfFile } from '../../libs/del-pdffile';

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
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || '';

    const { data, totalItems } = await reportService.getQuotationReports({
      page,
      limit,
      search
    });

    const totalPages = Math.ceil(totalItems / limit);

    const payload = {
      status: true,
      message: 'Get quotation successfully',
      data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    res.status(200).json(payload);
  } catch (error) {
    console.error('Error getting quotation reports:', error);

    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
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

export const getQuotationNumber = async (req: Request, res: Response) => {
  try {
    const result = reportService.quotationNumber();
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error('Error getting quotation number:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const getQuotationInfoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const result = await reportService.getquotationInfo(id);

    if (!result) {
      res.status(404).json({
        status: false,
        message: 'Quotation not found'
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: 'Get quotation info successfully',
      data: result
    });
    return;
  } catch (error) {
    console.error('Error getting quotation info:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
    return;
  }
};

export const getPdfQuotationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const result = await reportService.getQuotationReportById(id);
    const items = await fetch(`https://tsatdata.com/api/quotations/${id}`);
    const itemsData = await items.json();
    if (!result) {
      res.status(404).json({
        status: false,
        message: 'Quotation not found'
      });
      return;
    }

    const payload: IQuotation = {
      id: result.id,
      createdAt: result.createdAt,
      references: result.references,
      report: result.inspectionReport,
      items: itemsData.data,
      quotationId: id,
      inspectionReportId: result.inspectionReportId,
      invoicePrice: result.invoicePrice
    };

    const { fileUrl } = await generatePdfFromTemplate(
      generateQuotationPaper,
      payload
    );

    let deleted = false;
    if (result.pdfUrl) {
      const { deleted: del } = deletePdfFile(result.pdfUrl);
      deleted = del;
    }

    await reportService.updateQuotationReport(id, {
      pdfUrl: fileUrl
    });

    res.status(200).json({
      status: true,
      message: 'Get quotation info successfully',
      data: result
    });
    return;
  } catch (error) {
    console.error('Error getting quotation info:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
    return;
  }
};
