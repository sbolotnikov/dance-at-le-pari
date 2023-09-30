-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_templateID_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventtype" "EventType" NOT NULL DEFAULT 'Group';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES "EventTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
