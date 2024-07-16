/*
  Warnings:

  - The `displayedVideos` column on the `Party` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Party" DROP COLUMN "displayedVideos",
ADD COLUMN     "displayedVideos" TEXT[];
