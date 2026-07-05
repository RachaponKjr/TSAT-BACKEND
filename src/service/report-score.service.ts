import { prisma as db } from '../libs/prisma';
import { ReqUpdateCriteriaResult } from '../types/reportInspection.type';

// อัปเดตคะแนน + คำอธิบาย ของ CriteriaResult เดียว (จุดเดียวที่ user แก้ได้)
const updateScoreReport = async ({
  data,
  id
}: {
  data: ReqUpdateCriteriaResult;
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

  // sync คะแนนรวมขึ้นไปที่ ItemResult -> CategoryResult
  await recalculateScores({ criteriaResultId: id });

  return criteriaResult;
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

  const criteriaResult = await db.inspectionCriteriaResult.update({
    where: { id: criteriaResultId },
    data: {
      selectedOptionId: option.id,
      score: option.score,
      description: option.description
    }
  });

  await recalculateScores({ criteriaResultId });

  return criteriaResult;
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
  if (!criteriaResult) return;

  const itemTotal = await db.inspectionCriteriaResult.aggregate({
    where: { itemResultId: criteriaResult.itemResultId },
    _sum: { score: true }
  });

  const itemResult = await db.inspectionItemResult.update({
    where: { id: criteriaResult.itemResultId },
    data: { score: itemTotal._sum.score ?? 0 }
  });

  const categoryTotal = await db.inspectionItemResult.aggregate({
    where: { categoryResultId: itemResult.categoryResultId },
    _sum: { score: true }
  });

  await db.inspectionCategoryResult.update({
    where: { id: itemResult.categoryResultId },
    data: { score: categoryTotal._sum.score ?? 0 }
  });
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
