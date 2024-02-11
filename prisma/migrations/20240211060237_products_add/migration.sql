-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'Floor_Fee';

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "eventtype" "EventType" NOT NULL DEFAULT 'Private',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
