/*
  Warnings:

  - You are about to drop the column `interval` on the `ScheduleEvent` table. All the data in the column will be lost.
  - You are about to drop the column `repeating` on the `ScheduleEvent` table. All the data in the column will be lost.
  - You are about to drop the column `until` on the `ScheduleEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduleEvent" DROP COLUMN "interval",
DROP COLUMN "repeating",
DROP COLUMN "until",
ALTER COLUMN "tag" SET DEFAULT '';
