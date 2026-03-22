-- CreateTable
CREATE TABLE "IntakeChangeLog" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeChangeLog_pkey" PRIMARY KEY ("id")
);
