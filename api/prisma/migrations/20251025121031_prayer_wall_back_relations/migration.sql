-- CreateTable
CREATE TABLE "PrayerRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerComment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrayerRequest_createdById_idx" ON "PrayerRequest"("createdById");

-- CreateIndex
CREATE INDEX "PrayerLike_userId_idx" ON "PrayerLike"("userId");

-- CreateIndex
CREATE INDEX "PrayerLike_requestId_idx" ON "PrayerLike"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerLike_userId_requestId_key" ON "PrayerLike"("userId", "requestId");

-- CreateIndex
CREATE INDEX "PrayerBookmark_userId_idx" ON "PrayerBookmark"("userId");

-- CreateIndex
CREATE INDEX "PrayerBookmark_requestId_idx" ON "PrayerBookmark"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerBookmark_userId_requestId_key" ON "PrayerBookmark"("userId", "requestId");

-- CreateIndex
CREATE INDEX "PrayerComment_userId_idx" ON "PrayerComment"("userId");

-- CreateIndex
CREATE INDEX "PrayerComment_requestId_idx" ON "PrayerComment"("requestId");

-- AddForeignKey
ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerLike" ADD CONSTRAINT "PrayerLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerLike" ADD CONSTRAINT "PrayerLike_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PrayerRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerBookmark" ADD CONSTRAINT "PrayerBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerBookmark" ADD CONSTRAINT "PrayerBookmark_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PrayerRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerComment" ADD CONSTRAINT "PrayerComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerComment" ADD CONSTRAINT "PrayerComment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PrayerRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
