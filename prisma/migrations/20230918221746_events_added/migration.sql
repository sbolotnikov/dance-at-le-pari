-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Private', 'Group', 'Party');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Student';

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventtype" "EventType" NOT NULL DEFAULT 'Group',
    "length" INTEGER NOT NULL,
    "color" TEXT,
    "price" DECIMAL(65,30),
    "image" TEXT,
    "tag" TEXT NOT NULL,
    "title" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "visible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teachersid" INTEGER[],
    "studentsid" INTEGER[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
