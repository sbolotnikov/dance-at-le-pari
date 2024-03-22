-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'Blocked';

-- AlterTable
ALTER TABLE "ScheduleEvent" ALTER COLUMN "eventtype" SET DEFAULT 'Private';
