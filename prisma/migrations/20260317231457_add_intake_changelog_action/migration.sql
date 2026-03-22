-- AlterTable
ALTER TABLE "IntakeChangeLog" ADD COLUMN     "action" TEXT NOT NULL DEFAULT 'updated',
ADD COLUMN     "referenceId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "actorEmail" SET DEFAULT 'system',
ALTER COLUMN "field" DROP NOT NULL;
