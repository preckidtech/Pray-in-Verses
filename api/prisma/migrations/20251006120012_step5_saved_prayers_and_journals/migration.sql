-- CreateEnum
CREATE TYPE "PublishState" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "CuratedPrayer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "book" TEXT,
    "chapter" INTEGER,
    "verse" INTEGER,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "state" "PublishState" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuratedPrayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSavedPrayer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "curatedPrayerId" TEXT NOT NULL,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSavedPrayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedPrayer_userId_curatedPrayerId_key" ON "UserSavedPrayer"("userId", "curatedPrayerId");

-- AddForeignKey
ALTER TABLE "UserSavedPrayer" ADD CONSTRAINT "UserSavedPrayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPrayer" ADD CONSTRAINT "UserSavedPrayer_curatedPrayerId_fkey" FOREIGN KEY ("curatedPrayerId") REFERENCES "CuratedPrayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
