import { PrismaClient } from '@prisma/client';
import { HomeCMS } from '../types/cms-type';

const db = new PrismaClient();

async function getCmsHome() {
  const cmsHome = await db.cMSHOME.findMany();
  return cmsHome;
}

async function updateCMSHome(data: HomeCMS) {
  const updatedCMSHome = await db.cMSHOME.update({
    where: { id: 1 },
    data: {
      headerTitle: data.headerTitle,
      headerSubTitle: data.headerSubTitle,
      headerSlide: data.headerSlide,
      headerChooseService: data.headerChooseService,
      SubChooseService: data.SubChooseService,
      headerServiceInteresting: data.headerServiceInteresting,
      SubServiceinIeresting: data.SubServiceinIeresting,
      reasonHeader: data.reasonHeader,
      reasonSub1: data.reasonSub1
    }
  });

  return updatedCMSHome;
}

export { getCmsHome, updateCMSHome };
