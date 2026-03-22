-- AlterTable
ALTER TABLE "MachineIntake" ADD COLUMN     "engineerNotes" TEXT,
ADD COLUMN     "price" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
