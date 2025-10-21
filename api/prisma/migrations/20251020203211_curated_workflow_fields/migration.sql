-- AlterTable
ALTER TABLE "CuratedPrayer" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "state" "PublishState" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedById" TEXT;

-- AddForeignKey
ALTER TABLE "CuratedPrayer" ADD CONSTRAINT "CuratedPrayer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratedPrayer" ADD CONSTRAINT "CuratedPrayer_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
