/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BusinessSetting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `BusinessSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessSetting" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSetting_userId_key" ON "BusinessSetting"("userId");
