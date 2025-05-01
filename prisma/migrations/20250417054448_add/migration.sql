/*
  Warnings:

  - Added the required column `image` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `CarSubModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarSubModel" ADD COLUMN     "image" TEXT NOT NULL;
