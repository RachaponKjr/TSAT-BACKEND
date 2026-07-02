import { prisma as db } from '../libs/prisma';
import { ReqOpenReport } from '../types/reportusedcar.type';

const openReport = async ({ data }: { data: ReqOpenReport }) => {
  const report = await db.reportInfo.create({
    data: {
      customerName: data.customerName,
      carModelId: data.carModel,
      carSubModelId: data.carSubModelId,
      vin_code: data.vin_code,
      year: data.year,
      mileage: data.mileage,
      license_plate: data.license_plate
    }
  });
  return report;
};

export { openReport };
