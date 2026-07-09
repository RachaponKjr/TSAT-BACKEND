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
  optionId
}: {
  criteriaResultId: string;
  optionId: string;
}) => {
  const option = await db.inspectionCriteriaOption.findUnique({
    where: { id: optionId }
  });
  if (!option) {
    throw new Error('Option not found');
  }

  const existingCriteriaResult = await db.inspectionCriteriaResult.findUnique({
    where: { id: criteriaResultId }
  });
  if (!existingCriteriaResult) {
    throw new Error(`ไม่พบ criteriaResult id: ${criteriaResultId}`);
  }

  const criteriaResult = await db.inspectionCriteriaResult.update({
    where: { id: criteriaResultId },
    data: {
      selectedOptionId: option.id,
      score: option.score,
      description: option.description
    }
  });

  // ไล่คะแนนขึ้นทุกชั้น พร้อมอัปเดต totalScore/maxScore/overallGrade ของใบตรวจด้วย
  const updatedReport = await recalculateScores({ criteriaResultId });

  return { criteriaResult, report: updatedReport };
};

// คำนวณคะแนนรวมใหม่ไล่ขึ้นจาก criteria -> item -> category
const recalculateScores = async ({
  criteriaResultId
}: {
  criteriaResultId: string;
}) => {
  const criteriaResult = await db.inspectionCriteriaResult.findUnique({
    where: { id: criteriaResultId },
    include: { itemResult: true }
  });
  if (!criteriaResult) return null;

  // 1. sum criteria ทั้งหมดในitem เดียวกัน -> อัปเดต itemResult.score
  const itemTotal = await db.inspectionCriteriaResult.aggregate({
    where: { itemResultId: criteriaResult.itemResultId },
    _sum: { score: true }
  });

  const itemResult = await db.inspectionItemResult.update({
    where: { id: criteriaResult.itemResultId },
    data: { score: itemTotal._sum.score ?? 0 }
  });

  // 2. sum item ทั้งหมดใน category เดียวกัน -> อัปเดต categoryResult.score
  const categoryTotal = await db.inspectionItemResult.aggregate({
    where: { categoryResultId: itemResult.categoryResultId },
    _sum: { score: true }
  });

  const categoryResult = await db.inspectionCategoryResult.update({
    where: { id: itemResult.categoryResultId },
    data: { score: categoryTotal._sum.score ?? 0 }
  });

  // 3. sum category ทั้งหมดใน report เดียวกัน -> อัปเดต report.totalScore/maxScore/overallGrade
  const reportTotal = await db.inspectionCategoryResult.aggregate({
    where: { reportId: categoryResult.reportId },
    _sum: { score: true, maxScore: true }
  });

  const totalScore = reportTotal._sum.score ?? 0;
  const maxScore = reportTotal._sum.maxScore ?? 0;
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const overallGrade = calculateGrade(percentage);

  const updatedReport = await db.inspectionReport.update({
    where: { id: categoryResult.reportId },
    data: {
      totalScore,
      maxScore,
      overallGrade
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
