ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_stampId_fkey";

ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_userId_fkey";

ALTER TABLE "StampAllocation" DROP CONSTRAINT "StampAllocation_pdaApplicationId_fkey";

ALTER TABLE "PdaApplication" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,2);

CREATE INDEX "CollectionItem_userId_idx" ON "CollectionItem"("userId");

CREATE INDEX "CollectionItem_stampId_idx" ON "CollectionItem"("stampId");

CREATE INDEX "PdaApplication_userId_idx" ON "PdaApplication"("userId");

CREATE INDEX "StampAllocation_pdaApplicationId_idx" ON "StampAllocation"("pdaApplicationId");

CREATE INDEX "StampAllocation_stampId_idx" ON "StampAllocation"("stampId");

CREATE INDEX "StampAllocation_applicantId_idx" ON "StampAllocation"("applicantId");

ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_stampId_fkey" FOREIGN KEY ("stampId") REFERENCES "Stamp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "StampAllocation" ADD CONSTRAINT "StampAllocation_pdaApplicationId_fkey" FOREIGN KEY ("pdaApplicationId") REFERENCES "PdaApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
