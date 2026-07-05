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

// แก้ชื่อ template
const ReqUpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional()
});

// แก้ category (name, order)
const ReqUpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  order: z.number().int().optional()
});

// แก้ item (name, description, order)
const ReqUpdateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().optional()
});

// เพิ่ม item ใหม่เข้า category ที่มีอยู่แล้ว
const ReqCreateItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().default(0),
  criteria: z
    .array(
      z.object({
        label: z.string().min(1),
        order: z.number().int().default(0),
        options: z
          .array(
            z.object({
              score: z.number().int(),
              description: z.string().min(1),
              order: z.number().int().default(0)
            })
          )
          .min(1)
      })
    )
    .min(1)
});

// แก้ criteria (label, order)
const ReqUpdateCriteriaSchema = z.object({
  label: z.string().min(1).optional(),
  order: z.number().int().optional()
});

// แก้ option เดิม (score, description) — จุดที่แก้บ่อยสุด
const ReqUpdateOptionSchema = z.object({
  score: z.number().int().optional(),
  description: z.string().min(1).optional(),
  order: z.number().int().optional()
});

// เพิ่ม option ใหม่เข้า criteria ที่มีอยู่แล้ว
const ReqCreateOptionSchema = z.object({
  score: z.number().int(),
  description: z.string().min(1),
  order: z.number().int().default(0)
});

const ReqCreateCategorySchema = z.object({
  name: z.string().min(1),
  order: z.number().int().default(0),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        order: z.number().int().default(0),
        criteria: z
          .array(
            z.object({
              label: z.string().min(1),
              order: z.number().int().default(0),
              options: z
                .array(
                  z.object({
                    score: z.number().int(),
                    description: z.string().min(1),
                    order: z.number().int().default(0)
                  })
                )
                .min(1)
            })
          )
          .min(1)
      })
    )
    .default([]) // สร้าง category เปล่าก่อนได้ แล้วค่อยเพิ่ม item ทีหลังผ่าน create-template-item
});

const ReqCreateCriteriaSchema = z.object({
  label: z.string().min(1),
  order: z.number().int().default(0),
  options: z
    .array(
      z.object({
        score: z.number().int(),
        description: z.string().min(1),
        order: z.number().int().default(0)
      })
    )
    .min(1)
});

type ReqCreateTemplate = z.infer<typeof ReqCreateTemplateSchema>;
type ReqUpdateTemplate = z.infer<typeof ReqUpdateTemplateSchema>;
type ReqUpdateCategory = z.infer<typeof ReqUpdateCategorySchema>;
type ReqUpdateItem = z.infer<typeof ReqUpdateItemSchema>;
type ReqCreateItem = z.infer<typeof ReqCreateItemSchema>;
type ReqUpdateCriteria = z.infer<typeof ReqUpdateCriteriaSchema>;
type ReqUpdateOption = z.infer<typeof ReqUpdateOptionSchema>;
type ReqCreateOption = z.infer<typeof ReqCreateOptionSchema>;
type ReqCreateCategory = z.infer<typeof ReqCreateCategorySchema>;
type ReqCreateCriteria = z.infer<typeof ReqCreateCriteriaSchema>;
export {
  ReqCreateTemplateSchema,
  ReqUpdateTemplateSchema,
  ReqUpdateCategorySchema,
  ReqUpdateItemSchema,
  ReqCreateItemSchema,
  ReqUpdateCriteriaSchema,
  ReqUpdateOptionSchema,
  ReqCreateOptionSchema,
  ReqCreateCategorySchema,
  ReqCreateCriteriaSchema
};
export type {
  ReqCreateTemplate,
  ReqUpdateTemplate,
  ReqUpdateCategory,
  ReqUpdateItem,
  ReqCreateItem,
  ReqUpdateCriteria,
  ReqUpdateOption,
  ReqCreateOption,
  ReqCreateCategory,
  ReqCreateCriteria
};
