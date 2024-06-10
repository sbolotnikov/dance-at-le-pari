/*
  Warnings:

  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `EventTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "EventTemplate" DROP COLUMN "price";
