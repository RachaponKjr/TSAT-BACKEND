import { prisma as db } from '../libs/prisma';

const getContact = async () => {
  const contact = await db.contactInformation.findMany();
  return contact;
};

const updateContact = async ({ id, data }) => {
  const contact = await db.contactInformation.update({
    where: { id },
    data
  });
  return contact;
};

export { getContact, updateContact };
