import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const getCmsHome = async () => {
  const cmsHome = await db.cMSHomePage.findFirst();
  return cmsHome;
};

const updateCmsHome = async ({ id, data }) => {
  const cmsHome = await db.cMSHomePage.update({
    where: { id },
    data
  });
  return cmsHome;
};

const getCmsService = async () => {
  const cmsService = await db.cMSServicePage.findFirst();
  return cmsService;
};

const updateCmsService = async ({ id, data }) => {
  const cmsService = await db.cMSServicePage.update({
    where: { id },
    data
  });
  return cmsService;
};
const getCmsProduct = async () => {
  const cmsProduct = await db.cMSProductPage.findFirst();
  return cmsProduct;
};

const updateCmsProduct = async ({ id, data }) => {
  const cmsProduct = await db.cMSProductPage.update({
    where: { id },
    data
  });
  return cmsProduct;
};

const getCmsCustumer = async () => {
  const cmsCustumer = await db.cMSCustomerPage.findFirst();
  return cmsCustumer;
};

const updateCmsCustumer = async ({ id, data }) => {
  const cmsCustumer = await db.cMSCustomerPage.update({
    where: { id },
    data
  });
  return cmsCustumer;
};
const getCmsAbout = async () => {
  const cmsCustumer = await db.cMSAboutPage.findFirst();
  return cmsCustumer;
};

const updateCmsAbout = async ({ id, data }) => {
  const cmsCustumer = await db.cMSAboutPage.update({
    where: { id },
    data
  });
  return cmsCustumer;
};
const getCmsContact = async () => {
  const cmsCustumer = await db.cMSContactPage.findFirst();
  return cmsCustumer;
};

const updateCmsContact = async ({ id, data }) => {
  const cmsCustumer = await db.cMSContactPage.update({
    where: { id },
    data
  });
  return cmsCustumer;
};

export {
  getCmsHome,
  updateCmsHome,
  getCmsService,
  updateCmsService,
  getCmsProduct,
  updateCmsProduct,
  getCmsCustumer,
  updateCmsCustumer,
  getCmsAbout,
  updateCmsAbout,
  getCmsContact,
  updateCmsContact
};
