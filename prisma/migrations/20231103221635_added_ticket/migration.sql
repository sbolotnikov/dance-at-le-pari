-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tableName" TEXT DEFAULT 'Table',
ADD COLUMN     "tables" INTEGER[];

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "place" INTEGER,
    "table" INTEGER,
    "userID" INTEGER,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "invoice" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
