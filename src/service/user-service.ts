import { Role } from '@prisma/client';
import { prisma as db } from '../libs/prisma';

export interface User {
  username: string;
  password: string;
  role?: string;
}

const createUserService = async (data: User) => {
  const user = await db.user.create({
    data: {
      ...data,
      role: (data.role as Role) || Role.USER
    }
  });
  return user;
};

const getUserService = async ({ username }: { username: string }) => {
  const users = await db.user.findFirst({
    where: {
      username
    }
  });
  return users;
};

const getUserAllService = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      role: true
    }
  });
  return users;
};

const deleteUserService = async (id: string) => {
  const user = await db.user.delete({ where: { id: id } });
  return user;
};

const updateUserService = async (id: string, data: User) => {
  const user = await db.user.update({
    where: {
      id
    },
    data: {
      ...data,
      role: data.role ? (data.role as Role) : undefined
    }
  });
  return user;
};

export {
  createUserService,
  getUserService,
  getUserAllService,
  deleteUserService,
  updateUserService
};
