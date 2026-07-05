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

export { getReportCategoryList, getReportCategoryById };
