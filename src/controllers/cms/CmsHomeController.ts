import { Request, Response } from 'express';
import * as CMSHomeService from '../../service/CMSHomeService';
import { HomeCMS } from '../../types/cms-type';

const getCMSHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const cmsHome = await CMSHomeService.getCmsHome();
    res.status(200).json(cmsHome);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCMSHome = async (
  req: Request<object, object, HomeCMS>,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        status: 400,
        message: 'ไม่พบข้อมูลที่ต้องการอัปเดต'
      });
      return;
    }

    const updatedCMSHome = await CMSHomeService.updateCMSHome(req.body);
    res.status(200).json({
      status: 200,
      data: updatedCMSHome
    });
    return;
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server Error', error });
    return;
  }
};

export { getCMSHome, updateCMSHome };
