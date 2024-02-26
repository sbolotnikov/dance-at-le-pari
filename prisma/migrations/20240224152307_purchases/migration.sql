-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('Purchased', 'Used', 'Pending');

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "activitieID" INTEGER NOT NULL,
    "status" "StatusType" NOT NULL,
    "seat" INTEGER,
    "table" INTEGER,
    "userID" INTEGER,
    "personNote" TEXT,
    "invoice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchasedAt" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "eventtype" "EventType" NOT NULL DEFAULT 'Group',
    "tag" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "date" TEXT,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
