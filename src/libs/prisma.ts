import { PrismaClient } from '@prisma/client';

// ประกาศตัวแปร global เพื่อเก็บ instance ของ Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// เช็คว่ามี instance อยู่แล้วไหม? ถ้ามีให้ใช้ตัวเดิม ถ้าไม่มีให้สร้างใหม่
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// ถ้าไม่ได้อยู่ใน Production ให้เก็บ instance ใส่ global variable ไว้
// เพื่อกันไม่ให้สร้างใหม่ตอน Hot Reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
