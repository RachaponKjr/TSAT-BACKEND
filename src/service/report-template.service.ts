import { prisma as db } from '../libs/prisma';
import {
  ReqCreateItem,
  ReqCreateOption,
  ReqCreateTemplate,
  ReqUpdateCategory,
  ReqUpdateCriteria,
  ReqUpdateItem,
  ReqUpdateOption,
  ReqUpdateTemplate
} from '../types/reportTemplate.type';

// สร้าง template ทั้งชุด (category -> item -> criteria -> option) ในทีเดียว
const createTemplate = async ({ data }: { data: ReqCreateTemplate }) => {
  const template = await db.inspectionTemplate.create({
    data: {
      name: data.name,
      categories: {
        create: data.categories.map((category) => ({
          name: category.name,
          order: category.order,
          items: {
            create: category.items.map((item) => ({
              name: item.name,
              description: item.description,
              order: item.order,
              criteria: {
                create: item.criteria.map((criteria) => ({
                  label: criteria.label,
                  order: criteria.order,
                  options: {
                    create: criteria.options.map((option) => ({
                      score: option.score,
                      description: option.description,
                      order: option.order
                    }))
                  }
                }))
              }
            }))
          }
        }))
      }
    },
    include: {
      categories: {
        include: {
          items: {
            include: {
              criteria: { include: { options: true } }
            }
          }
        }
      }
    }
  });

  return template;
};

const getTemplateList = async () => {
  const list = await db.inspectionTemplate.findMany({
    where: { isActive: true },
    select: { id: true, name: true, isActive: true, createdAt: true }
  });
  return list;
};

const getTemplateById = async ({ id }: { id: string }) => {
  const template = await db.inspectionTemplate.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: { order: 'asc' },
        include: {
          items: {
            orderBy: { order: 'asc' },
            include: {
              criteria: {
                orderBy: { order: 'asc' },
                include: { options: { orderBy: { order: 'asc' } } }
              }
            }
          }
        }
      }
    }
  });
  return template;
};

// ปิด template เก่า (ไม่ลบ เพราะใบตรวจเก่ายังอ้างอิงอยู่)
const deactivateTemplate = async ({ id }: { id: string }) => {
  const template = await db.inspectionTemplate.update({
    where: { id },
    data: { isActive: false }
  });
  return template;
};

// ===== TEMPLATE level =====
const updateTemplateInfo = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateTemplate;
}) => {
  const template = await db.inspectionTemplate.update({
    where: { id },
    data
  });
  return template;
};

// ===== CATEGORY level =====
const updateCategoryTemplate = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateCategory;
}) => {
  const category = await db.inspectionCategoryTemplate.update({
    where: { id },
    data
  });
  return category;
};

// ===== ITEM level =====
const updateItemTemplate = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateItem;
}) => {
  const item = await db.inspectionItemTemplate.update({
    where: { id },
    data
  });
  return item;
};

// เพิ่ม item ใหม่เข้า category เดิม (ใบตรวจเก่าจะไม่มี item นี้ ไม่กระทบข้อมูลเก่า)
const createItemTemplate = async ({
  categoryId,
  data
}: {
  categoryId: string;
  data: ReqCreateItem;
}) => {
  const item = await db.inspectionItemTemplate.create({
    data: {
      categoryId,
      name: data.name,
      description: data.description,
      order: data.order,
      criteria: {
        create: data.criteria.map((c) => ({
          label: c.label,
          order: c.order,
          options: { create: c.options }
        }))
      }
    },
    include: { criteria: { include: { options: true } } }
  });
  return item;
};

// ลบ item — กันพังถ้ามีใบตรวจเก่าอ้างอิงอยู่แล้ว
const deleteItemTemplate = async ({ id }: { id: string }) => {
  const usedCount = await db.inspectionItemResult.count({
    where: { itemId: id }
  });
  if (usedCount > 0) {
    throw new Error(
      `ลบไม่ได้ เพราะมีใบตรวจ ${usedCount} ใบใช้ item นี้อยู่แล้ว ให้ตั้ง isActive แทนหรือสร้าง template เวอร์ชันใหม่`
    );
  }
  const item = await db.inspectionItemTemplate.delete({ where: { id } });
  return item;
};

// ===== CRITERIA level =====
const updateCriteriaTemplate = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateCriteria;
}) => {
  const criteria = await db.inspectionCriteriaTemplate.update({
    where: { id },
    data
  });
  return criteria;
};

// ===== OPTION level — จุดที่แก้บ่อยสุด (คะแนน + คำอธิบาย ของ rubric) =====
const updateCriteriaOption = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateOption;
}) => {
  const option = await db.inspectionCriteriaOption.update({
    where: { id },
    data
  });
  return option;
};

// เพิ่ม option ใหม่เข้า criteria เดิม
const createCriteriaOption = async ({
  criteriaId,
  data
}: {
  criteriaId: string;
  data: ReqCreateOption;
}) => {
  const option = await db.inspectionCriteriaOption.create({
    data: { criteriaId, ...data }
  });
  return option;
};

// ลบ option — กันพังถ้ามีใบตรวจเก่าเลือก option นี้ไว้อยู่แล้ว
const deleteCriteriaOption = async ({ id }: { id: string }) => {
  const usedCount = await db.inspectionCriteriaResult.count({
    where: { selectedOptionId: id }
  });
  if (usedCount > 0) {
    throw new Error(
      `ลบไม่ได้ เพราะมีใบตรวจ ${usedCount} ใบเลือก option นี้ไว้อยู่แล้ว`
    );
  }
  const option = await db.inspectionCriteriaOption.delete({ where: { id } });
  return option;
};

export {
  createTemplate,
  getTemplateList,
  getTemplateById,
  deactivateTemplate,
  updateTemplateInfo,
  updateCategoryTemplate,
  updateItemTemplate,
  createItemTemplate,
  deleteItemTemplate,
  updateCriteriaTemplate,
  updateCriteriaOption,
  createCriteriaOption,
  deleteCriteriaOption
};
