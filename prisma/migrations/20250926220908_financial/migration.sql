/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `installments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installments" ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "paymentMethod";
