-- CreateTable
CREATE TABLE "BusinessSettings" (
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

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSettings_userEmail_key" ON "BusinessSettings"("userEmail");
