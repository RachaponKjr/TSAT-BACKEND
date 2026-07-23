import { z } from 'zod';

export const QuotationReportSchema = z.object({
  quotationId: z.string(),
  inspectionReportId: z.string(),
  pdfUrl: z.string().optional().nullable(),
  invoicePrice: z.number().int().nonnegative(),
  // ใช้ z.coerce.date() เพื่อแปลง string format จาก JSON ให้เป็น Date object อัตโนมัติ
  pdfExpireDate: z.coerce.date().optional().nullable(),
  invoiceExpireDate: z.coerce.date().optional().nullable(),
  remark: z.string().optional().nullable()
});

export const QuotationItemSingleSchema = z.object({
  id: z.string().optional(),
  quotationReportId: z.string(),
  itemId: z.string(),
  quantity: z.number().int().positive()
});

export const QuotationItemArraySchema = z.array(QuotationItemSingleSchema);

export const ReferencesSchema = z.object({
  refUrl: z.string().optional().nullable(),
  refLogo: z.string().optional().nullable(),
  carImageHigh: z.string().optional().nullable(),
  priceHigh: z.number().int().optional().nullable(),
  carImageLow: z.string().optional().nullable(),
  priceLow: z.number().int().optional().nullable(),
  averagePrice: z.number().int().optional().nullable(),
  quotationReportId: z.string()
});

export type ReqOpenQuotationReport = z.infer<typeof QuotationReportSchema>;
export type ReqOpenQuotationReportItem = z.infer<
  typeof QuotationItemSingleSchema
>;
export type ReqReferences = z.infer<typeof ReferencesSchema>;
