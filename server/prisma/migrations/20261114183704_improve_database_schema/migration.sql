/*
  Warnings:

  - You are about to alter the column `balance` on the `PdaApplication` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_stampId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "StampAllocation" DROP CONSTRAINT "StampAllocation_pdaApplicationId_fkey";

-- AlterTable
ALTER TABLE "PdaApplication" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,2);

-- CreateIndex
CREATE INDEX "CollectionItem_userId_idx" ON "CollectionItem"("userId");

-- CreateIndex
CREATE INDEX "CollectionItem_stampId_idx" ON "CollectionItem"("stampId");

-- CreateIndex
CREATE INDEX "PdaApplication_userId_idx" ON "PdaApplication"("userId");

-- CreateIndex
CREATE INDEX "StampAllocation_pdaApplicationId_idx" ON "StampAllocation"("pdaApplicationId");

-- CreateIndex
CREATE INDEX "StampAllocation_stampId_idx" ON "StampAllocation"("stampId");

-- CreateIndex
CREATE INDEX "StampAllocation_applicantId_idx" ON "StampAllocation"("applicantId");

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_stampId_fkey" FOREIGN KEY ("stampId") REFERENCES "Stamp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StampAllocation" ADD CONSTRAINT "StampAllocation_pdaApplicationId_fkey" FOREIGN KEY ("pdaApplicationId") REFERENCES "PdaApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
