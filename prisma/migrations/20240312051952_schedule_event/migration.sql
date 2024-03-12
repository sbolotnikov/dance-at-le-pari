-- CreateTable
CREATE TABLE "ScheduleEvent" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "eventtype" "EventType" NOT NULL DEFAULT 'Group',
    "length" INTEGER NOT NULL,
    "teachersid" INTEGER NOT NULL,
    "studentid" INTEGER[],
    "location" TEXT,
    "repeating" BOOLEAN NOT NULL DEFAULT false,
    "interval" INTEGER,
    "until" TEXT,

    CONSTRAINT "ScheduleEvent_pkey" PRIMARY KEY ("id")
);
