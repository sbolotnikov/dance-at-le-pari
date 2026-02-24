-- CreateTable
CREATE TABLE "UrgentMessage" (
    "id" SERIAL NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "pages" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UrgentMessage_pkey" PRIMARY KEY ("id")
);
