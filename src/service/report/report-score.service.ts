import { prisma as db } from '../../libs/prisma';

interface TypeReqCreateReportScore {
  title: string;
  score: number;
  description?: string;
  reportItemId: string;
}

const createScoreReport = async (payload: TypeReqCreateReportScore) => {
  try {
    const score = await db.reportScore.create({
      data: payload
    });
    return score;
  } catch (error) {
    console.error('Error creating score report:', error);
    throw error;
  }
};

const updateScoreReport = async (
  payload: Partial<TypeReqCreateReportScore>,
  id: string
) => {
  try {
    const score = await db.reportScore.update({
      where: {
        id
      },
      data: payload
    });
    return score;
  } catch (error) {
    console.error('Error updating score report:', error);
    throw error;
  }
};

const deleteScoreReport = async (id: string) => {
  try {
    const score = await db.reportScore.delete({
      where: {
        id
      }
    });
    return score;
  } catch (error) {
    console.error('Error deleting score report:', error);
    throw error;
  }
};

const getScoreReportList = async () => {
  try {
    const score = await db.reportScore.findMany();
    return score;
  } catch (error) {
    console.error('Error getting score report list:', error);
    throw error;
  }
};

export {
  createScoreReport,
  updateScoreReport,
  deleteScoreReport,
  getScoreReportList
};
