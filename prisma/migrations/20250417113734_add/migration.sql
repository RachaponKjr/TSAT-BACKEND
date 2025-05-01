-- DropForeignKey
ALTER TABLE "CarService" DROP CONSTRAINT "CarService_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "images" TEXT[];
