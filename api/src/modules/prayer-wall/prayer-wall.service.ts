import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrayerWallService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    const data = await this.prisma.prayerRequest.create({
      data: { ...dto, createdById: userId },
    });
    return { data };
  }

  async list(q?: string, category?: string, cursor?: string | null, limit = 20) {
    const where: any = {};
    if (q) {
      where.OR = [
        { title:       { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { equals: category, mode: 'insensitive' };

    const rows = await this.prisma.prayerRequest.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: [{ urgent: 'desc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > limit) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }
    return { data: rows, nextCursor };
  }

  async get(id: string) {
    const row = await this.prisma.prayerRequest.findUnique({
      where: { id },
      include: {
        _count: { select: { likes: true, comments: true, bookmarks: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, email: true } } },
        },
      },
    });
    if (!row) throw new NotFoundException();
    return { data: row };
  }

  async toggleLike(userId: string, requestId: string) {
    const existing = await this.prisma.prayerLike.findUnique({
      where: { userId_requestId: { userId, requestId } },
    });
    if (existing) {
      await this.prisma.prayerLike.delete({ where: { id: existing.id } });
      return { liked: false };
    }
    await this.prisma.prayerLike.create({ data: { userId, requestId } });
    return { liked: true };
  }

  async toggleBookmark(userId: string, requestId: string) {
    const existing = await this.prisma.prayerBookmark.findUnique({
      where: { userId_requestId: { userId, requestId } },
    });
    if (existing) {
      await this.prisma.prayerBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await this.prisma.prayerBookmark.create({ data: { userId, requestId } });
    return { bookmarked: true };
  }

  async addComment(userId: string, requestId: string, body: string) {
    const req = await this.prisma.prayerRequest.findUnique({ where: { id: requestId }, select: { id: true } });
    if (!req) throw new NotFoundException();
    const data = await this.prisma.prayerComment.create({
      data: { body, requestId, userId },
      include: { user: { select: { id: true, email: true } } },
    });
    return { data };
  }

  async removeComment(userId: string, id: string) {
    const c = await this.prisma.prayerComment.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!c) throw new NotFoundException();
    if (c.userId !== userId) throw new ForbiddenException('You can only delete your comment');
    await this.prisma.prayerComment.delete({ where: { id } });
    return { ok: true };
  }
}
