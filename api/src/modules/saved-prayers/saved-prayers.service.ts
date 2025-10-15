import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavedPrayersService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, limit = 20, cursor?: string | null) {
    const rows = await this.prisma.savedPrayer.findMany({
      where: { userId },
      include: { curatedPrayer: true },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | null = null;
    if (rows.length > limit) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }

    return {
      data: rows.map(r => ({
        id: r.curatedPrayer.id,
        book: r.curatedPrayer.book,
        chapter: r.curatedPrayer.chapter,
        verse: r.curatedPrayer.verse,
        theme: r.curatedPrayer.theme,
        scriptureText: r.curatedPrayer.scriptureText,
        insight: r.curatedPrayer.insight,
        prayerPoints: r.curatedPrayer.prayerPoints,
        closing: r.curatedPrayer.closing,
        savedAt: r.createdAt,
        isSaved: true,
      })),
      nextCursor,
    };
  }

  async save(userId: string, curatedPrayerId: string) {
    const exists = await this.prisma.curatedPrayer.findUnique({ where: { id: curatedPrayerId }, select: { id: true } });
    if (!exists) throw new BadRequestException('Curated prayer not found');

    await this.prisma.savedPrayer.upsert({
      where: { userId_curatedPrayerId: { userId, curatedPrayerId } },
      update: {},
      create: { userId, curatedPrayerId },
    });
    return { ok: true };
  }

  async unsave(userId: string, curatedPrayerId: string) {
    await this.prisma.savedPrayer.delete({
      where: { userId_curatedPrayerId: { userId, curatedPrayerId } },
    }).catch(() => {});
    return { ok: true };
  }
}
