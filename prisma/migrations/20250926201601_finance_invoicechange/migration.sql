/*
  Warnings:

  - Added the required column `effectiveDate` to the `installments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installments" ADD COLUMN     "effectiveDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "packageType" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;
