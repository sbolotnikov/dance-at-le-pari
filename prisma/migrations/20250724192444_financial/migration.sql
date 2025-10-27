-- AlterTable
ALTER TABLE "ScheduleEvent" ADD COLUMN     "sessionNumber" TEXT;

-- CreateTable
CREATE TABLE "invoices" (
    "_id" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "discount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "installments" (
    "_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "invoice_sessions" (
    "_id" TEXT NOT NULL,
    "sessionType" "EventType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "numberOfSessions" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "invoice_sessions_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_sessions" ADD CONSTRAINT "invoice_sessions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
