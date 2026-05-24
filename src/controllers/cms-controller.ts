import { Request, Response } from 'express';
import {
  getCmsAbout,
  getCmsContact,
  getCmsCustumer,
  getCmsHome,
  getCmsProduct,
  getCmsService,
  updateCmsAbout,
  updateCmsContact,
  updateCmsCustumer,
  updateCmsHome,
  updateCmsProduct,
  updateCmsService
} from '../service/cms';
import redisClient from '../libs/redis';

const getCmsHomeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 🟢 1. ตั้งชื่อคีย์สำหรับเก็บแคชหน้าแรกให้ชัดเจน
  const CACHE_KEY = 'cms:home:data';

  try {
    const cachedCmsHome = await redisClient.get(CACHE_KEY);

    if (cachedCmsHome) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedCmsHome),
        fromCache: true
      });
      return;
    }

    const cmsHome = await getCmsHome();

    await redisClient.set(CACHE_KEY, JSON.stringify(cmsHome), {
      EX: 3600 * 24
    });

    res.status(200).json({ status: 200, data: cmsHome });
    return;
  } catch (error) {
    console.error('❌ Error in getCmsHomeController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCmsHomeController = async (req: Request, res: Response) => {
  try {
    // ดึงไฟล์จาก multer
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // clone body มาใช้งาน
    const payload: any = { ...req.body };
    // ถ้ามีไฟล์ ก็เพิ่ม path/filename ลง payload
    if (files?.bannerImage?.[0]) {
      payload.banner_image = `/uploads/cms/${files.bannerImage[0].filename}`;
    }
    if (files?.bannerImage2?.[0]) {
      payload.banner_info_image = `/uploads/cms/${files.bannerImage2[0].filename}`;
    }

    // ส่ง payload + id ไปอัปเดท
    const cmsHome = await updateCmsHome({
      data: payload,
      id: req.params.id
    });

    res.status(200).json({ status: 200, data: cmsHome });
    return;
  } catch (error) {
    console.error('updateCmsHomeController error:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getCmsServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'cms:service:data';

  try {
    const cachedCmsService = await redisClient.get(CACHE_KEY);

    if (cachedCmsService) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedCmsService),
        fromCache: true
      });
      return;
    }

    const cmsService = await getCmsService();

    await redisClient.set(CACHE_KEY, JSON.stringify(cmsService), {
      EX: 3600 * 24
    });

    res.status(200).json({ status: 200, data: cmsService });
    return;
  } catch (error) {
    console.error('❌ Error in getCmsServiceController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const updateCmsServiceController = async (req: Request, res: Response) => {
  try {
    const cmsService = await updateCmsService({
      data: req.body,
      id: req.params.id
    });

    res.status(200).json({ status: 200, data: cmsService });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const getCmsProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'cms:product:data';

  try {
    const cachedCmsProduct = await redisClient.get(CACHE_KEY);

    if (cachedCmsProduct) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedCmsProduct),
        fromCache: true
      });
      return;
    }

    const cmsProduct = await getCmsProduct();

    await redisClient.set(CACHE_KEY, JSON.stringify(cmsProduct), {
      EX: 86400
    });

    res.status(200).json({ status: 200, data: cmsProduct });
    return;
  } catch (error) {
    console.error('❌ Error in getCmsProductController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCmsProductController = async (req: Request, res: Response) => {
  try {
    const cmsProduct = await updateCmsProduct({
      data: req.body,
      id: req.params.id
    });
    res.status(200).json({ status: 200, data: cmsProduct });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getCustumersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'cms:customer:data';

  try {
    const cachedCustomers = await redisClient.get(CACHE_KEY);

    if (cachedCustomers) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedCustomers),
        fromCache: true
      });
      return;
    }

    const data = await getCmsCustumer();

    await redisClient.set(CACHE_KEY, JSON.stringify(data), {
      EX: 86400
    });

    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    console.error('❌ Error in getCustumersController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCustumersController = async (req: Request, res: Response) => {
  try {
    const data = await updateCmsCustumer({
      id: req.params.id,
      data: req.body
    });
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const getAboutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'cms:about:data';

  try {
    const cachedAbout = await redisClient.get(CACHE_KEY);

    if (cachedAbout) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedAbout),
        fromCache: true
      });
      return;
    }

    const data = await getCmsAbout();

    await redisClient.set(CACHE_KEY, JSON.stringify(data), {
      EX: 86400
    });

    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    console.error('❌ Error in getAboutController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const updateAboutController = async (req: Request, res: Response) => {
  try {
    const data = await updateCmsAbout({
      id: req.params.id,
      data: req.body
    });
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};
const getContactController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'cms:contact:data';

  try {
    const cachedContact = await redisClient.get(CACHE_KEY);

    if (cachedContact) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedContact),
        fromCache: true
      });
      return;
    }

    const data = await getCmsContact();

    await redisClient.set(CACHE_KEY, JSON.stringify(data), {
      EX: 86400
    });

    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    console.error('❌ Error in getContactController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateContactController = async (req: Request, res: Response) => {
  try {
    const data = await updateCmsContact({
      id: req.params.id,
      data: req.body
    });
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

export {
  getCmsHomeController,
  updateCmsHomeController,
  getCmsServiceController,
  updateCmsServiceController,
  getCmsProductController,
  updateCmsProductController,
  getCustumersController,
  updateCustumersController,
  getAboutController,
  updateAboutController,
  getContactController,
  updateContactController
};
