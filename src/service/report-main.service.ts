import { prisma as db } from '../libs/prisma';
import { ReqOpenReport } from '../types/reportInspection.type';

// เปิดใบตรวจใหม่ + auto-seed โครงจาก template (ล็อกฟอร์มให้เหมือนกันทุกใบ)
const openReport = async ({ data }: { data: ReqOpenReport }) => {
  const template = await db.inspectionTemplate.findUnique({
    where: { id: data.templateId },
    include: {
      categories: {
        include: {
          items: {
            include: {
              criteria: {
                include: { options: true }
              }
            }
          }
        }
      }
    }
  });

  if (!template) {
    throw new Error('Template not found');
  }

  const report = await db.inspectionReport.create({
    data: {
      templateId: data.templateId,
      customerName: data.customerName,
      carModel: data.carModel,
      modelYear: data.modelYear,
      imageCar: data.imageCar,
      vin: data.vin,
      odometer: data.odometer,
      licensePlate: data.licensePlate,
      inspectorName: data.inspectorName,
      approverName: data.approverName,
      approvedAt: data.approvedAt,
      inspectedAt: data.inspectedAt,
      categoryResults: {
        create: template.categories.map((category) => ({
          categoryId: category.id,
          score: 0,
          maxScore: category.items.reduce(
            (sum, item) =>
              sum +
              item.criteria.reduce(
                (s, c) => s + Math.max(...c.options.map((o) => o.score), 0),
                0
              ),
            0
          ),
          itemResults: {
            create: category.items.map((item) => ({
              itemId: item.id,
              score: 0,
              maxScore: item.criteria.reduce(
                (s, c) => s + Math.max(...c.options.map((o) => o.score), 0),
                0
              ),
              criteriaResults: {
                create: item.criteria.map((criteria) => {
                  // default ใช้ option คะแนนสูงสุดของ rubric เป็นค่าเริ่มต้น
                  const defaultOption = criteria.options.reduce(
                    (max, o) => (o.score > (max?.score ?? -1) ? o : max),
                    criteria.options[0]
                  );
                  return {
                    criteriaId: criteria.id,
                    selectedOptionId: defaultOption?.id ?? null,
                    score: defaultOption?.score ?? 0,
                    description: defaultOption?.description ?? ''
                  };
                })
              }
            }))
          }
        }))
      }
    },
    include: {
      categoryResults: {
        include: {
          itemResults: {
            include: { criteriaResults: true }
          }
        }
      }
    }
  });

  return report;
};

const updateReport = async ({
  data,
  id
}: {
  data: Partial<ReqOpenReport>;
  id: string;
}) => {
  const report = await db.inspectionReport.update({
    where: { id },
    data: {
      ...data
    }
  });
  return report;
};

const deleteReport = async ({ id }: { id: string }) => {
  // categoryResults/itemResults/criteriaResults ลบตามด้วย onDelete: Cascade
  const report = await db.inspectionReport.delete({
    where: { id }
  });
  return report;
};

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 75) return 'B';
  return 'C';
};

const getReportFull = async () => {
  const reports = await db.inspectionReport.findMany({
    include: {
      template: true,
      categoryResults: {
        include: {
          category: true,
          itemResults: {
            include: {
              item: true,
              criteriaResults: {
                include: {
                  criteria: true,
                  selectedOption: true
                }
              }
            }
          }
        }
      }
    }
  });

  const reportsWithScore = reports.map((report) => {
    const totalScore = report.categoryResults.reduce(
      (sum, c) => sum + c.score,
      0
    );
    const maxScore = report.categoryResults.reduce(
      (sum, c) => sum + c.maxScore,
      0
    );
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const overallGrade = calculateGrade(percentage);

    return {
      ...report,
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      overallGrade
    };
  });

  return reportsWithScore;
};

const getReportById = async ({ id }: { id: string }) => {
  const report = await db.inspectionReport.findUnique({
    where: { id },
    include: {
      // 1. ดึงโครงสร้างเทมเพลตและบังคับจัดเรียง (orderBy) ล็อกตายตัวจากชั้นนี้เลย!
      template: {
        include: {
          categories: {
            orderBy: { order: 'asc' }, // ✅ ล็อกลำดับหมวดหมู่ใหญ่
            include: {
              items: {
                orderBy: { order: 'asc' }, // ✅ ล็อกลำดับรายการย่อย
                include: {
                  criteria: {
                    orderBy: { order: 'asc' }, // ✅ ล็อกลำดับเกณฑ์ประเมิน
                    include: {
                      options: { orderBy: { order: 'asc' } } // ✅ ล็อกตัวเลือกคะแนน
                    }
                  }
                }
              }
            }
          }
        }
      },
      // 2. ส่วนข้อมูลผลลัพธ์ (Results) ดึงมาเก็บไว้ธรรมดา ไม่ต้องสั่ง orderBy ซับซ้อนให้มันเอ๋อ
      categoryResults: {
        include: {
          itemResults: {
            include: {
              criteriaResults: {
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

  return report;
};

export { openReport, updateReport, deleteReport, getReportFull, getReportById };
