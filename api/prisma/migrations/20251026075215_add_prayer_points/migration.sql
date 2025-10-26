-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('OPEN', 'ANSWERED');

-- CreateTable
CREATE TABLE "PrayerPoint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "PrayerStatus" NOT NULL DEFAULT 'OPEN',
    "answeredAt" TIMESTAMP(3),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrayerPoint" ADD CONSTRAINT "PrayerPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
