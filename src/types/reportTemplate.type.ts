import { z } from 'zod';

const ReqCriteriaOptionSchema = z.object({
  score: z.number().int(),
  description: z.string().min(1),
  order: z.number().int().default(0)
});

const ReqCriteriaTemplateSchema = z.object({
  label: z.string().min(1),
  order: z.number().int().default(0),
  options: z
    .array(ReqCriteriaOptionSchema)
    .min(1, 'ต้องมีอย่างน้อย 1 ตัวเลือกคะแนน')
});

const ReqItemTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().default(0),
  criteria: z
    .array(ReqCriteriaTemplateSchema)
    .min(1, 'item ต้องมีอย่างน้อย 1 criteria')
});

const ReqCategoryTemplateSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().default(0),
  items: z
    .array(ReqItemTemplateSchema)
    .min(1, 'category ต้องมีอย่างน้อย 1 item')
});

const ReqCreateTemplateSchema = z.object({
  name: z.string().min(1),
  categories: z
    .array(ReqCategoryTemplateSchema)
    .min(1, 'template ต้องมีอย่างน้อย 1 category')
});

type ReqCreateTemplate = z.infer<typeof ReqCreateTemplateSchema>;

export { ReqCreateTemplateSchema };
export type { ReqCreateTemplate };
