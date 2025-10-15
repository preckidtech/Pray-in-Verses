import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CuratedPrayersService {
  constructor(private prisma: PrismaService) {}

  async list(params: {
    q?: string;
    book?: string;
    chapter?: number;
    limit?: number;
    cursor?: string | null;
    userId?: string | null;
  }) {
    const { q, book, chapter, limit = 20, cursor, userId } = params;

    const where: any = {};
    if (book) where.book = { equals: book, mode: 'insensitive' };
    if (typeof chapter === 'number') where.chapter = chapter;
    if (q) {
      where.OR = [
        { theme: { contains: q, mode: 'insensitive' } },
        { scriptureText: { contains: q, mode: 'insensitive' } },
        { insight: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.curatedPrayer.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const next = items.pop()!;
      nextCursor = next.id;
    }

    if (userId) {
      const ids = items.map((i) => i.id);
      const saved = await this.prisma.savedPrayer.findMany({
        where: { userId, curatedPrayerId: { in: ids } },
        select: { curatedPrayerId: true },
      });
      const savedSet = new Set(saved.map((s) => s.curatedPrayerId));
      return {
        data: items.map((i) => ({ ...i, isSaved: savedSet.has(i.id) })),
        nextCursor,
      };
    }

    return { data: items, nextCursor };
  }

  async byId(id: string, userId?: string | null) {
    const prayer = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!prayer) return null;
    if (!userId) return { ...prayer, isSaved: false };

    const saved = await this.prisma.savedPrayer.findUnique({
      where: { userId_curatedPrayerId: { userId, curatedPrayerId: id } },
      select: { id: true },
    });
    return { ...prayer, isSaved: !!saved };
  }
}
