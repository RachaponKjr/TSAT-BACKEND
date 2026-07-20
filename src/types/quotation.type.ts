import { z } from 'zod';

export const QuotationReportSchema = z.object({
  inspectionReportId: z.string(),
  pdfUrl: z.string().optional().nullable(),
  invoicePrice: z.number().int().nonnegative(),
  // ใช้ z.coerce.date() เพื่อแปลง string format จาก JSON ให้เป็น Date object อัตโนมัติ
  pdfExpireDate: z.coerce.date().optional().nullable(),
  invoiceExpireDate: z.coerce.date().optional().nullable(),
  remark: z.string().optional().nullable()
});

export const QuotationReportItemSchema = z.object({
  quotationReportId: z.string().uuid(),
  itemId: z.string(), // แก้จาก .uuid() เพราะใน schema Items.id เป็น cuid()
  quantity: z.number().int().positive()
});

export const ReferencesSchema = z.object({
  refUrl: z.string().optional().nullable(),
  refLogo: z.string().optional().nullable(),
  carImageHigh: z.string().optional().nullable(),
  priceHigh: z.number().int().optional().nullable(),
  carImageLow: z.string().optional().nullable(),
  priceLow: z.number().int().optional().nullable(),
  averagePrice: z.number().int().optional().nullable(),
  quotationReportId: z.string().uuid()
});

export type ReqOpenQuotationReport = z.infer<typeof QuotationReportSchema>;
export type ReqOpenQuotationReportItem = z.infer<
  typeof QuotationReportItemSchema
>;
export type ReqReferences = z.infer<typeof ReferencesSchema>;
