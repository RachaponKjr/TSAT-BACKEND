/*
  Warnings:

  - You are about to drop the column `detail` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `header` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "detail",
DROP COLUMN "header",
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
