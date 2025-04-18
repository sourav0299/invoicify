/*
  Warnings:

  - Added the required column `brandName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyContactEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyContactNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyGst` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "partyContactEmail" TEXT NOT NULL,
ADD COLUMN     "partyContactNumber" TEXT NOT NULL,
ADD COLUMN     "partyGst" TEXT NOT NULL;
