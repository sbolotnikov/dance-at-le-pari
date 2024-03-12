/*
  Warnings:

  - The `teachersid` column on the `ScheduleEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ScheduleEvent" DROP COLUMN "teachersid",
ADD COLUMN     "teachersid" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" TEXT;
