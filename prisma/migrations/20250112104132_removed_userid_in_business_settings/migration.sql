/*
  Warnings:

  - You are about to drop the column `userId` on the `BusinessSetting` table. All the data in the column will be lost.
  - Made the column `userEmail` on table `BusinessSetting` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "BusinessSetting_userId_key";

-- AlterTable
ALTER TABLE "BusinessSetting" DROP COLUMN "userId",
ALTER COLUMN "userEmail" SET NOT NULL;
