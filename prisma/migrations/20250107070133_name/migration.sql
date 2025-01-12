/*
  Warnings:

  - You are about to drop the `BusinessSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BusinessSettings";

-- CreateTable
CREATE TABLE "BusinessSetting" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessRegistrationType" TEXT NOT NULL,
    "isGstRegistered" BOOLEAN NOT NULL,
    "gstNumber" TEXT,
    "panNumber" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyNumber" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "termsAndConditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSetting_userEmail_key" ON "BusinessSetting"("userEmail");
