import { z } from 'zod';

export const ReqOpenReportSchema = z.object({
  customerName: z.string(),
  carModelId: z.string().optional(),
  carSubModelId: z.string().optional(),
  vin_code: z.string(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  license_plate: z.string().optional(),
  reportId: z.string().optional()
});

export type ReqOpenReport = z.infer<typeof ReqOpenReportSchema>;
