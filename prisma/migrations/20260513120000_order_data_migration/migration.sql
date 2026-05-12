-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "dataMigration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dataMigrationSize" TEXT,
ADD COLUMN     "dataMigrationNotes" TEXT;
