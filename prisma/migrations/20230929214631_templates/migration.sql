/*
  Warnings:

  - You are about to drop the column `color` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventtype` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `studentsid` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `teachersid` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Event` table. All the data in the column will be lost.
  - Added the required column `templateID` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "color",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "eventtype",
DROP COLUMN "image",
DROP COLUMN "length",
DROP COLUMN "location",
DROP COLUMN "price",
DROP COLUMN "studentsid",
DROP COLUMN "tag",
DROP COLUMN "teachersid",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
DROP COLUMN "visible",
ADD COLUMN     "templateID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EventTemplate" (
    "id" SERIAL NOT NULL,
    "eventtype" "EventType" NOT NULL DEFAULT 'Group',
    "length" INTEGER NOT NULL,
    "color" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "tag" TEXT NOT NULL,
    "title" TEXT,
    "location" TEXT,
    "description" TEXT,
    "visible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teachersid" INTEGER[],
    "studentsid" INTEGER[],

    CONSTRAINT "EventTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES "EventTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
