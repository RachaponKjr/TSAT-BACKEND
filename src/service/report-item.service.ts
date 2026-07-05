import { prisma as db } from '../libs/prisma';
import { ReqUpdateItemResult } from '../types/reportInspection.type';

const getItemReport = async ({
  categoryResultId
}: {
  categoryResultId: string;
}) => {
  const list = await db.inspectionItemResult.findMany({
    where: { categoryResultId },
    include: { item: true, criteriaResults: true }
  });
  return list;
};

// ใช้แก้แค่รูปภาพ (image) — ห้ามแก้ itemId/name เพราะมาจาก template
const updateItemReport = async ({
  data,
  id
}: {
  data: ReqUpdateItemResult;
  id: string;
}) => {
  const itemResult = await db.inspectionItemResult.update({
    where: { id },
    data: {
      imageUrl: data.imageUrl
    }
  });
  return itemResult;
};

export { getItemReport, updateItemReport };
