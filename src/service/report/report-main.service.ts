import { prisma as db } from '../../libs/prisma';
import { TypeReqCreateReportMain } from '../../controllers/report/report-main.controller';

const createMainReport = async (payload: TypeReqCreateReportMain) => {
  const result = await db.report.create({
    data: {
      ...payload
    }
  });
  return result;
};

const getReportMainList = async () => {
  const result = await db.report.findMany();
  return result;
};

const updateMainReport = async (
  payload: TypeReqCreateReportMain,
  id: string
) => {
  const result = await db.report.update({
    where: {
      id
    },
    data: {
      ...payload
    }
  });
  return result;
};

const deleteMainReport = async (id: string) => {
  const result = await db.report.delete({
    where: {
      id
    }
  });
  return result;
};

export {
  createMainReport,
  getReportMainList,
  updateMainReport,
  deleteMainReport
};
