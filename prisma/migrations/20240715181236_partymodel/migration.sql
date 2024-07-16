-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL DEFAULT 12,
    "displayedPictures" TEXT[],
    "displayedVideos" TEXT NOT NULL,
    "videoChoice" TEXT NOT NULL,
    "compLogo" TEXT NOT NULL,
    "titleBarHider" BOOLEAN NOT NULL DEFAULT false,
    "showUrgentMessage" BOOLEAN NOT NULL DEFAULT false,
    "displayedPicturesAuto" TEXT[],
    "seconds" INTEGER NOT NULL DEFAULT 10,
    "manualPicture" TEXT NOT NULL,
    "savedMessages" TEXT[],
    "textColor" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);
