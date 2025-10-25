import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishState } from '@prisma/client';

@Injectable()
export class CuratedPrayersService {
  constructor(private prisma: PrismaService) {}

  async listBooks() {
    const rows = await this.prisma.curatedPrayer.groupBy({
      by: ['book'],
      where: { state: 'PUBLISHED' }, // ← only published
      _count: { _all: true },
    });
    return rows.map(r => r.book).sort((a, b) => a.localeCompare(b));
  }

  async listChapters(book: string) {
    const rows = await this.prisma.curatedPrayer.groupBy({
      by: ['chapter'],
      where: {
        state: 'PUBLISHED', // ← only published
        book: { equals: book, mode: 'insensitive' },
      },
      _count: { _all: true },
    });
    return rows.map(r => r.chapter).sort((a, b) => a - b);
  }

  async listVerses(book: string, chapter: number) {
    const rows = await this.prisma.curatedPrayer.findMany({
      where: {
        state: 'PUBLISHED', // ← only published
        book: { equals: book, mode: 'insensitive' },
        chapter,
      },
      select: { verse: true },
      orderBy: { verse: 'asc' },
    });
    return rows.map(r => r.verse);
  }

  async getByRef(book: string, chapter: number, verse: number, userId: string) {
    const item = await this.prisma.curatedPrayer.findFirst({
      where: {
        state: 'PUBLISHED', // ← only published
        book: { equals: book, mode: 'insensitive' },
        chapter,
        verse,
      },
    });
    if (!item) throw new NotFoundException('Verse content not found');

    const saved = await this.prisma.savedPrayer.findUnique({
      where: { userId_curatedPrayerId: { userId, curatedPrayerId: item.id } },
      select: { id: true },
    });

    return {
      id: item.id,
      reference: `${item.book} ${item.chapter}:${item.verse}`,
      theme: item.theme,
      scriptureText: item.scriptureText,
      insight: item.insight,
      prayerPoints: item.prayerPoints,
      closing: item.closing,
      isSaved: !!saved,
    };
  }

  /**
   * Deterministic "Verse of the day":
   * - Pick a stable index based on today's YYYYMMDD
   * - Return 1 published curated entry
   */
  async verseofTheDay(){
    const count = await this.prisma.curatedPrayer.count({
      where: { state: PublishState.PUBLISHED},
    });
    if (!count) return null;

    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const index = seed % count;

    const rows = await this.prisma.curatedPrayer.findMany({
      where: { state: PublishState.PUBLISHED },
      orderBy: [{ book: 'asc'}, { chapter: 'asc'}, { verse: 'asc'}, {updatedAt: 'desc' }],
      skip: index,
      take: 1,
      select: {
        id:true, book:true, chapter:true, verse:true, theme: true, scriptureText: true, insight: true, prayerPoints: true, closing: true,
      },
    });
    return rows[0] ?? null;
  
  }

}
