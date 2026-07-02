import { z } from 'zod';

const ReqOpenReportSchema = z.object({
  customerName: z.string(),
  carModel: z.string().optional(),
  carSubModelId: z.string().optional(),
  vin_code: z.string(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  license_plate: z.string().optional()
});

export type ReqOpenReport = z.infer<typeof ReqOpenReportSchema>;
