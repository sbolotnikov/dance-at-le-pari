-- AlterTable
ALTER TABLE "SettingVar" ADD COLUMN     "specialPackage" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "weddingPackages" INTEGER[];
