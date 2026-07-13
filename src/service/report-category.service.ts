import { prisma as db } from '../libs/prisma';

const getReportCategoryList = async ({ reportId }: { reportId: string }) => {
  const list = await db.inspectionCategoryResult.findMany({
    where: { reportId },
    include: {
      category: true,
      itemResults: {
        include: { item: true, criteriaResults: true }
      }
    }
  });
  return list;
};

const getReportCategoryById = async ({ id }: { id: string }) => {
  const category = await db.inspectionCategoryResult.findUnique({
    where: { id },
    include: {
      category: true,
      itemResults: {
        include: { item: true, criteriaResults: true }
      }
    }
  });
  return category;
};

const updateCategoryResult = async ({
  id,
  data
}: {
  id: string;
  data: { description: string };
}) => {
  const result = await db.inspectionItemResult.update({
    where: { id },
    data
  });
  return result;
};

const updateCategoryResultRecommend = async ({
  id,
  data
}: {
  id: string;
  data: { recommend: string };
}) => {
  const result = await db.inspectionItemResult.update({
    where: { id },
    data
  });
  return result;
};

export {
  getReportCategoryList,
  getReportCategoryById,
  updateCategoryResult,
  updateCategoryResultRecommend
};
