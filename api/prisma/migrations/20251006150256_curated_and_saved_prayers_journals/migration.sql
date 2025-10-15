/*
  Warnings:

  - You are about to drop the column `body` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `CuratedPrayer` table. All the data in the column will be lost.
  - You are about to drop the `UserSavedPrayer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `closing` to the `CuratedPrayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insight` to the `CuratedPrayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scriptureText` to the `CuratedPrayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `CuratedPrayer` table without a default value. This is not possible if the table is not empty.
  - Made the column `book` on table `CuratedPrayer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter` on table `CuratedPrayer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verse` on table `CuratedPrayer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSavedPrayer" DROP CONSTRAINT "UserSavedPrayer_curatedPrayerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSavedPrayer" DROP CONSTRAINT "UserSavedPrayer_userId_fkey";

-- AlterTable
ALTER TABLE "CuratedPrayer" DROP COLUMN "body",
DROP COLUMN "createdById",
DROP COLUMN "publishedAt",
DROP COLUMN "state",
DROP COLUMN "tags",
DROP COLUMN "title",
DROP COLUMN "updatedById",
ADD COLUMN     "closing" TEXT NOT NULL,
ADD COLUMN     "insight" TEXT NOT NULL,
ADD COLUMN     "prayerPoints" TEXT[],
ADD COLUMN     "scriptureText" TEXT NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL,
ALTER COLUMN "book" SET NOT NULL,
ALTER COLUMN "chapter" SET NOT NULL,
ALTER COLUMN "verse" SET NOT NULL;

-- DropTable
DROP TABLE "public"."UserSavedPrayer";

-- CreateTable
CREATE TABLE "SavedPrayer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "curatedPrayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPrayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedPrayer_userId_createdAt_idx" ON "SavedPrayer"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPrayer_userId_curatedPrayerId_key" ON "SavedPrayer"("userId", "curatedPrayerId");

-- CreateIndex
CREATE INDEX "Journal_userId_createdAt_idx" ON "Journal"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "SavedPrayer" ADD CONSTRAINT "SavedPrayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPrayer" ADD CONSTRAINT "SavedPrayer_curatedPrayerId_fkey" FOREIGN KEY ("curatedPrayerId") REFERENCES "CuratedPrayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
