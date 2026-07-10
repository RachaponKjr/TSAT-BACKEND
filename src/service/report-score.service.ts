import { prisma as db } from '../libs/prisma';
import { ReqUpdateCriteriaResult } from '../types/reportInspection.type';

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 75) return 'B';
  return 'C';
};

// แก้คะแนน/คำอธิบายเอง (ไม่ผ่าน option)
const updateScoreReport = async ({
  data,
  id
}: {
  data: {
    score: number;
    description: string;
    selectedOptionId?: string | null;
  };
  id: string;
}) => {
  const criteriaResult = await db.inspectionCriteriaResult.update({
    where: { id },
    data: {
      score: data.score,
      description: data.description,
      selectedOptionId: data.selectedOptionId ?? null
    }
  });

  const updatedReport = await recalculateScores({ criteriaResultId: id });

  return { criteriaResult, report: updatedReport };
};

// เลือกจาก rubric option โดยตรง (ปุ่ม +3 สภาพดี ในภาพตัวอย่าง)
const selectScoreOption = async ({
  criteriaResultId,
  itemResultId,
  criteriaId,
  optionId
}: {
  criteriaResultId: string | null;
  itemResultId: string;
  criteriaId: string;
  optionId: string;
}) => {
  // 1. ค้นหาข้อมูลช้อยส์เกณฑ์คะแนน (Option)
  const option = await db.inspectionCriteriaOption.findUnique({
    where: { id: optionId }
  });
  if (!option) {
    throw new Error('Option not found');
  }

  // 2. ใช้คำสั่ง upsert แยกโครงสร้าง where ออกมาให้เคลียร์
  const criteriaResult = await db.inspectionCriteriaResult.upsert({
    // 💡 จัดระเบียบจุดนี้ใหม่: ถ้าหน้าบ้านส่ง id มา ให้หาด้วย id ตรงๆ
    // แต่ถ้าไม่มี id (เป็นเคสเริ่มต้นคะแนน 0) ให้หาด้วยคีย์คู่ที่ล็อกตามสเปกตาราง
    where: criteriaResultId
      ? { id: criteriaResultId }
      : {
          itemResultId_criteriaId: {
            itemResultId,
            criteriaId
          }
        },
    // เคสที่ 1: เจอข้อมูลเก่าอยู่แล้ว -> อัปเดตคะแนนและรายละเอียดใหม่
    update: {
      selectedOptionId: option.id,
      score: option.score,
      description: option.description
    },
    // เคสที่ 2: ยังไม่เคยมีข้อมูลในระบบ (เป็นคะแนนแรก) -> สร้างข้อมูลลงตารางใหม่
    create: {
      itemResultId,
      criteriaId,
      selectedOptionId: option.id,
      score: option.score,
      description: option.description
    }
  });

  // 3. อัปเดตคะแนนรวมไล่ขึ้นไปบนใบตรวจหลัก
  const updatedReport = await recalculateScores({
    criteriaResultId: criteriaResult.id
  });

  return { criteriaResult, report: updatedReport };
};

// คำนวณคะแนนรวมใหม่ไล่ขึ้นจาก criteria -> item -> category
const recalculateScores = async ({
  criteriaResultId
}: {
  criteriaResultId: string;
}) => {
  // 1. หาความสัมพันธ์ของ IDs ทั้งหมด (Item, Category, Report) จาก Criteria ตัวที่กดเลือก
  const currentCriteria = await db.inspectionCriteriaResult.findUnique({
    where: { id: criteriaResultId },
    include: {
      itemResult: {
        include: {
          categoryResult: true
        }
      }
    }
  });

  if (!currentCriteria || !currentCriteria.itemResult) return null;

  const itemResultId = currentCriteria.itemResultId;
  const categoryResultId = currentCriteria.itemResult.categoryResultId;
  const reportId = currentCriteria.itemResult.categoryResult.reportId;

  // -------------------------------------------------------------
  // ชั้นที่ 1: คำนวณในระดับ ItemResult (รวมทุก Criteria ใน Item เดียวกัน)
  // -------------------------------------------------------------
  // ดึง Criteria ทุกข้อที่อยู่ใน Item นี้ เพื่อหาผลรวมของคะแนนจริง และคะแนนเต็มสูงสุด
  const allCriteriaInItem = await db.inspectionCriteriaResult.findMany({
    where: { itemResultId: itemResultId },
    include: {
      criteria: {
        include: {
          options: true // ดึงตัวเลือก Rubric ทั้งหมดมาหาคะแนนที่มากที่สุด
        }
      }
    }
  });

  let itemScore = 0;
  let itemMaxScore = 0;

  for (const crit of allCriteriaInItem) {
    itemScore += crit.score ?? 0; // คะแนนที่ช่างเลือกจริง

    // หาคะแนนที่สูงที่สุดในบรรดา Option ของ Criteria ข้อนี้ เพื่อใช้เป็นคะแนนเต็ม (Max Score)
    const maxOptionScore = crit.criteria.options.reduce((max, opt) => {
      return opt.score > max ? opt.score : max;
    }, 0);

    itemMaxScore += maxOptionScore;
  }

  // อัปเดตผลลัพธ์ลงใน ItemResult ตัวปัจจุบัน
  await db.inspectionItemResult.update({
    where: { id: itemResultId },
    data: {
      score: itemScore,
      maxScore: itemMaxScore
    }
  });

  // -------------------------------------------------------------
  // ชั้นที่ 2: คำนวณในระดับ CategoryResult (รวมทุก Item ใน Category เดียวกัน)
  // -------------------------------------------------------------
  const itemAgg = await db.inspectionItemResult.aggregate({
    where: { categoryResultId: categoryResultId },
    _sum: {
      score: true,
      maxScore: true
    }
  });

  await db.inspectionCategoryResult.update({
    where: { id: categoryResultId },
    data: {
      score: itemAgg._sum.score ?? 0,
      maxScore: itemAgg._sum.maxScore ?? 0
    }
  });

  // -------------------------------------------------------------
  // ชั้นที่ 3: คำนวณในระดับ InspectionReport (รวมทุก Category ใน Report ฉบับนี้)
  // -------------------------------------------------------------
  const categoryAgg = await db.inspectionCategoryResult.aggregate({
    where: { reportId: reportId },
    _sum: {
      score: true,
      maxScore: true
    }
  });

  const totalScore = categoryAgg._sum.score ?? 0;
  const maxScore = categoryAgg._sum.maxScore ?? 0;

  // ป้องกันการหารด้วย 0 (Division by zero)
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  // เรียกใช้ฟังก์ชันคำนวณเกรดของคุณ (เช่น >= 90 ได้ A, >= 80 ได้ B)
  const overallGrade = calculateGrade(percentage);

  // อัปเดตคะแนนรวมสุทธิและเกรดลงในใบประเมิน
  const updatedReport = await db.inspectionReport.update({
    where: { id: reportId },
    data: {
      totalScore,
      maxScore,
      overallGrade
    },
    include: {
      categoryResults: {
        include: {
          itemResults: {
            include: {
              criteriaResults: true
            }
          }
        }
      }
    }
  });

  return updatedReport;
};

const getScoreReportList = async ({
  itemResultId
}: {
  itemResultId: string;
}) => {
  const list = await db.inspectionCriteriaResult.findMany({
    where: { itemResultId },
    include: { criteria: true, selectedOption: true }
  });
  return list;
};

export { updateScoreReport, selectScoreOption, getScoreReportList };
