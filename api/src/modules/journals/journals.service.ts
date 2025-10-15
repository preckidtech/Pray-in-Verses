import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJournalDto, UpdateJournalDto } from './dto';

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, q?: string, limit = 20, cursor?: string | null) {
    const where: any = { userId };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
      ];
    }
    const rows = await this.prisma.journal.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | null = null;
    if (rows.length > limit) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }
    return { data: rows, nextCursor };
  }

  async create(userId: string, dto: CreateJournalDto) {
    return { data: await this.prisma.journal.create({ data: { ...dto, userId } }) };
  }

  async get(userId: string, id: string) {
    const row = await this.prisma.journal.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();
    return { data: row };
  }

  async update(userId: string, id: string, dto: UpdateJournalDto) {
    const row = await this.prisma.journal.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();
    return { data: await this.prisma.journal.update({ where: { id }, data: dto }) };
  }

  async remove(userId: string, id: string) {
    const row = await this.prisma.journal.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();
    await this.prisma.journal.delete({ where: { id } });
    return { ok: true };
  }
}
