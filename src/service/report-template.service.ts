import { prisma as db } from '../libs/prisma';
import { ReqCreateTemplate } from '../types/reportTemplate.type';

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

export { createTemplate, getTemplateList, getTemplateById, deactivateTemplate };
