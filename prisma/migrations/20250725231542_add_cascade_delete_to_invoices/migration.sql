-- DropForeignKey
ALTER TABLE "installments" DROP CONSTRAINT "installments_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "invoice_sessions" DROP CONSTRAINT "invoice_sessions_invoiceId_fkey";

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_sessions" ADD CONSTRAINT "invoice_sessions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
