import { prisma as db } from '../libs/prisma';
import { InspectionForm } from '../template/used-car-form';
import {
  ReqCreateCategory,
  ReqCreateCriteria,
  ReqCreateItem,
  ReqCreateOption,
  ReqCreateTemplate,
  ReqUpdateCategory,
  ReqUpdateCriteria,
  ReqUpdateItem,
  ReqUpdateOption,
  ReqUpdateTemplate
} from '../types/reportTemplate.type';
import { ReqUpdateFullTemplate } from '../types/reportTemplateUpdate.type';

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

const getCriteriaOptionList = async ({
  criteriaId
}: {
  criteriaId: string;
}) => {
  const options = await db.inspectionCriteriaOption.findMany({
    where: { criteriaId },
    orderBy: { order: 'asc' }
  });
  return options;
};

const createCategoryTemplate = async ({
  templateId,
  data
}: {
  templateId: string;
  data: ReqCreateCategory;
}) => {
  // 1. สร้าง Category และโครงสร้าง Items / Criteria ทั้งหมดในฝั่ง Template ก่อน
  const category = await db.inspectionCategoryTemplate.create({
    data: {
      templateId,
      name: data.name,
      order: data.order,
      items: {
        create: data.items.map((item) => ({
          name: item.name,
          description: item.description,
          order: item.order,
          criteria: {
            create: item.criteria.map((c) => ({
              label: c.label,
              order: c.order,
              options: { create: c.options }
            }))
          }
        }))
      }
    },
    include: {
      items: {
        include: { criteria: { include: { options: true } } }
      }
    }
  });

  // 💡 2. ไฮไลท์เด็ด: ดึงใบงาน (Reports) ทั้งหมดในระบบที่ยังตรวจไม่เสร็จ หรือผูกอยู่กับ Template นี้
  const activeReports = await db.inspectionReport.findMany({
    where: { templateId: templateId }
  });

  // 💡 3. วิ่ง Loop เพื่อสร้างข้อมูลผลลัพธ์ (Result Layer) ยัดกลับเข้าไปในใบงานเดิมให้ครบตามโครงสร้างใหม่
  if (activeReports.length > 0) {
    for (const report of activeReports) {
      // สร้าง CategoryResult ผูกเข้ากับใบงานนั้นๆ
      await db.inspectionCategoryResult.create({
        data: {
          reportId: report.id,
          categoryId: category.id,
          score: 0,
          maxScore: 0,
          // แตกไอเทมย่อย (Items)
          itemResults: {
            create: category.items.map((item) => ({
              itemId: item.id,
              score: 0,
              maxScore: 0,
              // แตกเกณฑ์ประเมินย่อย (Criteria)
              criteriaResults: {
                create: item.criteria.map((c) => ({
                  criteriaId: c.id,
                  score: 0,
                  description: '' // เว้นว่างรอให้ช่างมากรอกหรือเลือก option
                }))
              }
            }))
          }
        }
      });
    }
  }

  return category;
};

// ลบ category — กันพังถ้ามีใบตรวจเก่าอ้างอิงอยู่ (ผ่าน item ใน category นี้)
const deleteCategoryTemplate = async ({ id }: { id: string }) => {
  const usedCount = await db.inspectionCategoryResult.count({
    where: { categoryId: id }
  });
  if (usedCount > 0) {
    throw new Error(
      `ลบไม่ได้ เพราะมีใบตรวจ ${usedCount} ใบใช้ category นี้อยู่แล้ว`
    );
  }
  const category = await db.inspectionCategoryTemplate.delete({
    where: { id }
  });
  return category;
};

const createCriteriaTemplate = async ({
  itemId,
  data
}: {
  itemId: string;
  data: ReqCreateCriteria;
}) => {
  const criteria = await db.inspectionCriteriaTemplate.create({
    data: {
      itemId,
      label: data.label,
      order: data.order,
      options: { create: data.options }
    },
    include: { options: true }
  });
  return criteria;
};

const deleteCriteriaTemplate = async ({ id }: { id: string }) => {
  const usedCount = await db.inspectionCriteriaResult.count({
    where: { criteriaId: id }
  });
  if (usedCount > 0) {
    throw new Error(
      `ลบไม่ได้ เพราะมีใบตรวจ ${usedCount} ใบใช้ criteria นี้อยู่แล้ว`
    );
  }
  const criteria = await db.inspectionCriteriaTemplate.delete({
    where: { id }
  });
  return criteria;
};

const deleteTemplateById = async ({ id }: { id: string }) => {
  const template = await db.inspectionTemplate.delete({
    where: { id }
  });
  return template;
};

const updateFullTemplate = async ({
  id,
  data
}: {
  id: string;
  data: ReqUpdateFullTemplate;
}) => {
  return db.$transaction(async (tx) => {
    // 1. อัปเดตชื่อ template (ถ้ามีส่งมา)
    if (data.name) {
      await tx.inspectionTemplate.update({
        where: { id },
        data: { name: data.name }
      });
    }

    // ถ้าไม่ได้ส่ง categories มาเลย ก็จบแค่นี้ (แก้แค่ชื่อ)
    if (!data.categories) {
      return tx.inspectionTemplate.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              items: { include: { criteria: { include: { options: true } } } }
            }
          }
        }
      });
    }

    // 2. โหลดโครงเดิมทั้งหมดไว้เทียบว่าอะไรถูกลบออกจาก payload บ้าง
    const existingTemplate = await tx.inspectionTemplate.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            items: { include: { criteria: { include: { options: true } } } }
          }
        }
      }
    });
    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    const incomingCategoryIds = data.categories
      .map((c) => c.id)
      .filter((v): v is string => Boolean(v));

    // 3. ลบ category เดิมที่หายไปจาก payload (cascade ลบ item/criteria/option ตามไปด้วย)
    for (const existingCategory of existingTemplate.categories) {
      if (!incomingCategoryIds.includes(existingCategory.id)) {
        await tx.inspectionCategoryTemplate.delete({
          where: { id: existingCategory.id }
        });
      }
    }

    // 4. ไล่ทีละ category ใน payload: มี id = update, ไม่มี id = create
    for (const category of data.categories) {
      let categoryId = category.id;

      if (categoryId) {
        await tx.inspectionCategoryTemplate.update({
          where: { id: categoryId },
          data: { name: category.name, order: category.order }
        });
      } else {
        const created = await tx.inspectionCategoryTemplate.create({
          data: { templateId: id, name: category.name, order: category.order }
        });
        categoryId = created.id;
      }

      const existingCategory = existingTemplate.categories.find(
        (c) => c.id === category.id
      );
      const existingItems = existingCategory?.items ?? [];
      const incomingItemIds = category.items
        .map((i) => i.id)
        .filter((v): v is string => Boolean(v));

      // ลบ item เดิมที่หายไป
      for (const existingItem of existingItems) {
        if (!incomingItemIds.includes(existingItem.id)) {
          await tx.inspectionItemTemplate.delete({
            where: { id: existingItem.id }
          });
        }
      }

      for (const item of category.items) {
        let itemId = item.id;

        if (itemId) {
          await tx.inspectionItemTemplate.update({
            where: { id: itemId },
            data: {
              name: item.name,
              description: item.description,
              order: item.order
            }
          });
        } else {
          const createdItem = await tx.inspectionItemTemplate.create({
            data: {
              categoryId,
              name: item.name,
              description: item.description,
              order: item.order
            }
          });
          itemId = createdItem.id;
        }

        const existingItem = existingItems.find((i) => i.id === item.id);
        const existingCriteria = existingItem?.criteria ?? [];
        const incomingCriteriaIds = item.criteria
          .map((c) => c.id)
          .filter((v): v is string => Boolean(v));

        for (const existingCrit of existingCriteria) {
          if (!incomingCriteriaIds.includes(existingCrit.id)) {
            await tx.inspectionCriteriaTemplate.delete({
              where: { id: existingCrit.id }
            });
          }
        }

        for (const crit of item.criteria) {
          let criteriaId = crit.id;

          if (criteriaId) {
            await tx.inspectionCriteriaTemplate.update({
              where: { id: criteriaId },
              data: { label: crit.label, order: crit.order }
            });
          } else {
            const createdCrit = await tx.inspectionCriteriaTemplate.create({
              data: { itemId, label: crit.label, order: crit.order }
            });
            criteriaId = createdCrit.id;
          }

          const existingCritRecord = existingCriteria.find(
            (c) => c.id === crit.id
          );
          const existingOptions = existingCritRecord?.options ?? [];
          const incomingOptionIds = crit.options
            .map((o) => o.id)
            .filter((v): v is string => Boolean(v));

          for (const existingOpt of existingOptions) {
            if (!incomingOptionIds.includes(existingOpt.id)) {
              await tx.inspectionCriteriaOption.delete({
                where: { id: existingOpt.id }
              });
            }
          }

          for (const opt of crit.options) {
            if (opt.id) {
              await tx.inspectionCriteriaOption.update({
                where: { id: opt.id },
                data: {
                  score: opt.score,
                  description: opt.description,
                  order: opt.order
                }
              });
            } else {
              await tx.inspectionCriteriaOption.create({
                data: {
                  criteriaId,
                  score: opt.score,
                  description: opt.description,
                  order: opt.order
                }
              });
            }
          }
        }
      }
    }

    // 5. คืนค่า template เต็มก้อนล่าสุดหลัง sync เสร็จ
    return tx.inspectionTemplate.findUnique({
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
  });
};

const getReportData = async ({ id }: { id: string }) => {
  const template = await db.inspectionReport.findUnique({
    where: { id },
    include: {
      categoryResults: {
        orderBy: { id: 'asc' }, // หรือ field ที่กำหนดลำดับ category
        include: {
          category: true,
          itemResults: {
            orderBy: { id: 'asc' }, // หรือ field ที่กำหนดลำดับ item
            include: {
              item: true,
              criteriaResults: {
                orderBy: { id: 'asc' }, // หรือ field ที่กำหนดลำดับ criteria
                include: {
                  selectedOption: true
                }
              }
            }
          }
        }
      }
    }
  });

  const payload = {
    customerName: template?.customerName || '-',
    carModel: template?.carModel || '-',
    modelYear: template?.modelYear || '-',
    vin: template?.vin || '-',
    imageCar: template?.imageCar || '-',
    pdfUrl: template?.pdfUrl || '',
    performancePdfUrl: template?.performancePdfUrl || '',
    odometer: template?.odometer || '-',
    licensePlate: template?.licensePlate || '-',
    inspectorName: template?.inspectorName || '-',
    inspectedAt: template?.inspectedAt || '-',
    approverName: template?.approverName || '-',
    approvedAt: template?.approvedAt || '-',
    overallGrade: template?.overallGrade || '-',
    totalScore: template?.totalScore || 0,
    maxScore: template?.maxScore || 0,
    categoryResults: template?.categoryResults?.map((category) => ({
      categoryName: category.category.name,
      score: category.score,
      maxScore: category.maxScore,
      itemResults: category.itemResults.map((item) => ({
        item: item.item.name,
        description: item.description || '-',
        selectScore: item.criteriaResults.map((cri) => ({
          score: cri.selectedOption?.score,
          description: item.description || '-'
        }))
      }))
    }))
  };

  return payload as InspectionForm;
};

const updateReportCarUsedPdf = async ({
  id,
  url,
  performanceUrl
}: {
  id: string;
  url: string;
  performanceUrl: string;
}) => {
  const res = await db.inspectionReport.update({
    where: { id },
    data: {
      pdfUrl: url,
      performancePdfUrl: performanceUrl,
      pdfExpireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return res;
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
  deleteCriteriaOption,
  getCriteriaOptionList,
  createCategoryTemplate,
  deleteCategoryTemplate,
  createCriteriaTemplate,
  deleteCriteriaTemplate,
  deleteTemplateById,
  updateFullTemplate,
  getReportData,
  updateReportCarUsedPdf
};
