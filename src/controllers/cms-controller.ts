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

const getCmsHomeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cmsHome = await getCmsHome();
    res.status(200).json({ status: 200, data: cmsHome });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const updateCmsHomeController = async (req: Request, res: Response) => {
  try {
    const cmsHome = await updateCmsHome({ data: req.body, id: req.params.id });
    res.status(200).json({ status: 200, data: cmsHome });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

const getCmsServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cmsService = await getCmsService();
    res.status(200).json({ status: 200, data: cmsService });
    return;
  } catch (error) {
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
  try {
    const cmsProduct = await getCmsProduct();
    res.status(200).json({ status: 200, data: cmsProduct });
    return;
  } catch (error) {
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

const getCustumersController = async (req: Request, res: Response) => {
  try {
    const data = await getCmsCustumer();
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
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
const getAboutController = async (req: Request, res: Response) => {
  try {
    const data = await getCmsAbout();
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
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
const getContactController = async (req: Request, res: Response) => {
  try {
    const data = await getCmsContact();
    res.status(200).json({ status: 200, data });
    return;
  } catch (error) {
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
