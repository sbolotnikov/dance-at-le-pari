-- CreateTable
CREATE TABLE "PriceOptions" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tag" TEXT NOT NULL,
    "templateID" INTEGER NOT NULL,

    CONSTRAINT "PriceOptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceOptions" ADD CONSTRAINT "PriceOptions_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES "EventTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
