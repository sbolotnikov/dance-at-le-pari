-- CreateTable
CREATE TABLE "SettingVar" (
    "id" SERIAL NOT NULL,
    "front_templates_ids" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettingVar_pkey" PRIMARY KEY ("id")
);
