/*
  Warnings:

  - You are about to drop the column `effectiveDate` on the `installments` table. All the data in the column will be lost.
  - Added the required column `effectiveDate` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installments" DROP COLUMN "effectiveDate";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "effectiveDate" TIMESTAMP(3) NOT NULL;
