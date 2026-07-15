-- CreateEnum
CREATE TYPE "BillingItemTemplateStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "DocumentContent" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "sha256" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingItemTemplate" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "normalizedSearch" TEXT NOT NULL,
    "category" "BillingCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "vatTreatment" "VatTreatment" NOT NULL,
    "status" "BillingItemTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingItemTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentContent_documentId_key" ON "DocumentContent"("documentId");

-- CreateIndex
CREATE INDEX "DocumentContent_sha256_idx" ON "DocumentContent"("sha256");

-- CreateIndex
CREATE INDEX "BillingItemTemplate_normalizedSearch_idx" ON "BillingItemTemplate"("normalizedSearch");

-- CreateIndex
CREATE INDEX "BillingItemTemplate_category_idx" ON "BillingItemTemplate"("category");

-- CreateIndex
CREATE INDEX "BillingItemTemplate_status_idx" ON "BillingItemTemplate"("status");

-- AddForeignKey
ALTER TABLE "DocumentContent" ADD CONSTRAINT "DocumentContent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
