-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactnumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "businessLogoUrl" TEXT,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSetting_userEmail_key" ON "BusinessSetting"("userEmail");
