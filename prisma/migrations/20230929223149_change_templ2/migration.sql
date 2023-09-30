/*
  Warnings:

  - You are about to drop the column `studentsid` on the `EventTemplate` table. All the data in the column will be lost.
  - Added the required column `tag` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tag" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventTemplate" DROP COLUMN "studentsid";
