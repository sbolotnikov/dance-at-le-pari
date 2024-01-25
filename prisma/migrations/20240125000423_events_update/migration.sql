/*
  Warnings:

  - Added the required column `length` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visible` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "teachersid" INTEGER[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "visible" BOOLEAN NOT NULL;
