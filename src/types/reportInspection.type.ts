import { z } from 'zod';

// ============================
// OPEN / UPDATE REPORT (InspectionReport)
// ============================
const ReqOpenReportSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
  customerName: z.string().min(1, 'customerName is required'),
  imageCar: z.string().optional().nullable(),
  carModel: z.string().min(1, 'carModel is required'),
  modelYear: z.string().min(1, 'modelYear is required'),
  vin: z.string().min(1, 'vin is required'),
  odometer: z.number().int().nonnegative(),
  licensePlate: z.string().min(1, 'licensePlate is required'),
  inspectorName: z.string().optional().nullable(),
  approverName: z.string().optional().nullable(),
  approvedAt: z.string().optional().nullable(),
  inspectedAt: z.string().optional().nullable()
});

type ReqOpenReport = z.infer<typeof ReqOpenReportSchema>;

// ============================
// UPDATE CRITERIA RESULT (จุดเดียวที่แก้ได้ตอนกรอกใบ)
// ============================
const ReqUpdateCriteriaResultSchema = z.object({
  score: z.number().int(),
  description: z.string().min(1, 'description is required'),
  selectedOptionId: z.string().optional().nullable()
});

type ReqUpdateCriteriaResult = z.infer<typeof ReqUpdateCriteriaResultSchema>;

// ============================
// UPDATE ITEM RESULT (เช่น แก้รูปภาพ)
// ============================
const ReqUpdateItemResultSchema = z.object({
  imageUrl: z.string().url().optional().nullable()
});

type ReqUpdateItemResult = z.infer<typeof ReqUpdateItemResultSchema>;

export {
  ReqOpenReportSchema,
  ReqUpdateCriteriaResultSchema,
  ReqUpdateItemResultSchema
};
export type { ReqOpenReport, ReqUpdateCriteriaResult, ReqUpdateItemResult };
