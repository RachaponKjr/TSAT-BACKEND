import { z } from 'zod';

// ทุกชั้นมี id (optional) แนบมาด้วย — มี id = ของเดิม, ไม่มี id = สร้างใหม่
const ReqUpdateOptionSchema = z.object({
  id: z.string().optional(),
  score: z.number().int(),
  description: z.string().min(1),
  order: z.number().int().default(0)
});

const ReqUpdateCriteriaSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  order: z.number().int().default(0),
  options: z
    .array(ReqUpdateOptionSchema)
    .min(1, 'ต้องมีอย่างน้อย 1 ตัวเลือกคะแนน')
});

const ReqUpdateItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().default(0),
  criteria: z
    .array(ReqUpdateCriteriaSchema)
    .min(1, 'item ต้องมีอย่างน้อย 1 criteria')
});

const ReqUpdateCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  order: z.number().int().default(0),
  items: z.array(ReqUpdateItemSchema).min(1, 'category ต้องมีอย่างน้อย 1 item')
});

// name/categories เป็น optional ที่ระดับบนสุด (จะแก้แค่ชื่อ template อย่างเดียวก็ยังทำได้)
// แต่ถ้าส่ง categories มา ต้องส่งมาเป็นก้อนเต็ม (ทุก category ที่ต้องการให้มีอยู่หลัง update)
const ReqUpdateFullTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  categories: z.array(ReqUpdateCategorySchema).optional()
});

type ReqUpdateFullTemplate = z.infer<typeof ReqUpdateFullTemplateSchema>;

export { ReqUpdateFullTemplateSchema };
export type { ReqUpdateFullTemplate };
