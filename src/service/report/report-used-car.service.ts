import { prisma as db } from '../../libs/prisma';
import { ReqOpenReport } from '../../types/reportusedcar.type';

const openReport = async ({ data }: { data: ReqOpenReport }) => {
  const report = await db.reportInfo.create({
    data: {
      customerName: data.customerName,
      carModelId: data.carModelId,
      carSubModelId: data.carSubModelId,
      vin_code: data.vin_code,
      year: data.year,
      mileage: data.mileage,
      license_plate: data.license_plate
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
  const report = await db.reportInfo.update({
    where: { id },
    data: {
      ...data
    }
  });
  return report;
};

const deleteReport = async ({ id }: { id: string }) => {
  const report = await db.report.delete({
    where: {
      id
    }
  });
  return report;
};

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 75) return 'B';
  return 'C';
};

const MAX_SCORE_PER_ITEM = 3;

const getReportFull = async () => {
  const reports = await db.report.findMany({
    include: {
      reportInfos: {
        include: {
          carModel: true,
          carSubModel: true
        }
      },
      reportDetails: {
        include: {
          reportItems: {
            include: {
              reportScores: true
            }
          }
        }
      }
    }
  });

  const reportsWithScore = reports.map((report) => {
    let totalScore = 0;
    let maxScore = 0;

    report.reportDetails.forEach((detail) => {
      detail.reportItems.forEach((item) => {
        item.reportScores.forEach((score) => {
          totalScore += score.score;
          maxScore += MAX_SCORE_PER_ITEM;
        });
      });
    });

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

export { openReport, updateReport, deleteReport, getReportFull };
