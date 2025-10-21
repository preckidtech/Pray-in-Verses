import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}
