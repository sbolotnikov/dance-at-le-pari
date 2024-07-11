/*
  Warnings:

  - Added the required column `source` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "source" TEXT NOT NULL;
