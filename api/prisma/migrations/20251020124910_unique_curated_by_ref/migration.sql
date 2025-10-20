/*
  Warnings:

  - A unique constraint covering the columns `[book,chapter,verse]` on the table `CuratedPrayer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CuratedPrayer_book_chapter_verse_key" ON "CuratedPrayer"("book", "chapter", "verse");
