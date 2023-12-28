/*
  Warnings:

  - You are about to drop the column `image` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "image",
DROP COLUMN "place",
ADD COLUMN     "seat" INTEGER,
ALTER COLUMN "purchasedAt" SET DATA TYPE TEXT;
