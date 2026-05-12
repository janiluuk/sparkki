-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fi';

-- AlterTable
ALTER TABLE "UsbOrder" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fi';

-- CreateTable
CREATE TABLE "StripeProcessedEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeProcessedEvent_pkey" PRIMARY KEY ("id")
);
