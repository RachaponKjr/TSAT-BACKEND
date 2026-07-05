import { z } from 'zod';

// Schema สำหรับคำตอบแต่ละข้อที่ช่างกรอกมา
export const ReportAnswerInputSchema = z.object({
  reportScoreId: z.string().uuid('Invalid score criteria ID format'),
  scoreGiven: z.number().int().min(0, 'Score cannot be negative'),
  note: z.string().optional().nullable(),
  image_url: z.string().url('Invalid image URL format').optional().nullable()
});

// Schema หลักในการบันทึก / อัปเดตใบประเมิน
export const SaveReportSchema = z.object({
  car_url: z.string().url('Invalid car image URL format'),
  inspector: z
    .string()
    .min(1, 'Inspector name is required')
    .optional()
    .nullable(),
  approver: z
    .string()
    .min(1, 'Approver name is required')
    .optional()
    .nullable(),
  // ข้อมูลส่วนตัวของรถและลูกค้า
  customerName: z.string().min(1, 'Customer name is required'),
  carModelId: z
    .string()
    .uuid('Invalid car model ID format')
    .optional()
    .nullable(),
  carSubModelId: z
    .string()
    .uuid('Invalid car sub-model ID format')
    .optional()
    .nullable(),
  vin_code: z.string().min(1, 'VIN code is required'),
  year: z.string().optional().nullable(),
  mileage: z.string().optional().nullable(),
  license_plate: z.string().optional().nullable(),
  // อาเรย์ของคะแนนแต่ละข้อ
  answers: z
    .array(ReportAnswerInputSchema)
    .min(1, 'At least one answer is required')
});

export type SaveReportInput = z.infer<typeof SaveReportSchema>;
