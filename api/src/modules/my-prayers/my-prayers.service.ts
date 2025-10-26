import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrayerPointDto, UpdatePrayerPointDto } from './dto';
import { PrayerStatus } from '@prisma/client';

@Injectable()
export class MyPrayersService {
  constructor(private prisma: PrismaService) {}

  async stats(userId: string) {
    const [total, open, answered] = await Promise.all([
      this.prisma.prayerPoint.count({ where: { userId } }),
      this.prisma.prayerPoint.count({ where: { userId, status: PrayerStatus.OPEN } }),
      this.prisma.prayerPoint.count({ where: { userId, status: PrayerStatus.ANSWERED } }),
    ]);
    return { total, open, answered };
  }

  async list(userId: string, q?: string, status?: PrayerStatus | 'ALL') {
    const where: any = { userId };
    if (q?.trim()) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { body:  { contains: q, mode: 'insensitive' } },
        { tags:  { hasSome: q.toLowerCase().split(/\s+/).filter(Boolean) } },
      ];
    }
    if (status && status !== 'ALL') where.status = status;

    const data = await this.prisma.prayerPoint.findMany({
      where,
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });
    return { data };
  }

  async get(userId: string, id: string) {
    const row = await this.prisma.prayerPoint.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();
    return { data: row };
  }

  async create(userId: string, dto: CreatePrayerPointDto) {
    const data = await this.prisma.prayerPoint.create({
      data: {
        userId,
        title: dto.title,
        body: dto.body,
        tags: (dto.tags || []).map(t => String(t).trim()).filter(Boolean),
      },
    });
    return { data };
  }

  async update(userId: string, id: string, dto: UpdatePrayerPointDto) {
    const row = await this.prisma.prayerPoint.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();

    const data = await this.prisma.prayerPoint.update({
      where: { id },
      data: {
        ...dto,
        answeredAt: dto.status === 'ANSWERED' ? (row.answeredAt ?? new Date()) 
                   : dto.status === 'OPEN'     ? null 
                   : undefined,
        tags: dto.tags ? dto.tags.map(t => String(t).trim()).filter(Boolean) : undefined,
      },
    });
    return { data };
  }

  async toggle(userId: string, id: string) {
    const row = await this.prisma.prayerPoint.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();

    const next = row.status === 'OPEN' ? 'ANSWERED' : 'OPEN';
    const data = await this.prisma.prayerPoint.update({
      where: { id },
      data: {
        status: next,
        answeredAt: next === 'ANSWERED' ? new Date() : null,
      },
    });
    return { data };
  }

  async remove(userId: string, id: string) {
    const row = await this.prisma.prayerPoint.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.userId !== userId) throw new ForbiddenException();

    await this.prisma.prayerPoint.delete({ where: { id } });
    return { ok: true };
  }
}
