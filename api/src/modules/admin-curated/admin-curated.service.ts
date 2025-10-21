import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCuratedPrayerDto, UpdateCuratedPrayerDto } from './dto';
import { PublishState, Role } from '@prisma/client';

@Injectable()
export class AdminCuratedService {
  constructor(private prisma: PrismaService) {}

  async list(userRole: Role, q?: string, state?: PublishState | string, book?: string, limit = 20, cursor?: string | null) {
    const where: any = {};
    if (book) where.book = { equals: book, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { theme:         { contains: q, mode: 'insensitive' } },
        { scriptureText: { contains: q, mode: 'insensitive' } },
        { insight:       { contains: q, mode: 'insensitive' } },
      ];
    }
    if (state) where.state = state;

    const rows = await this.prisma.curatedPrayer.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: [{ state: 'asc' }, { updatedAt: 'desc' }],
      select: {
        id: true, book: true, chapter: true, verse: true, theme: true, state: true,
        updatedAt: true, publishedAt: true, createdById: true, updatedById: true,
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > limit) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }
    return { data: rows, nextCursor };
  }

  async create(userId: string, dto: CreateCuratedPrayerDto) {
    try {
      const data = await this.prisma.curatedPrayer.create({
        data: {
          ...dto,
          state: PublishState.DRAFT,
          createdById: userId,
          updatedById: userId,
        },
      });
      return { data };
    } catch (e: any) {
      // handle unique (book,chapter,verse)
      if (e.code === 'P2002') {
        throw new BadRequestException('A curated entry already exists for this book/chapter/verse.');
      }
      throw e;
    }
  }

  async get(id: string) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    return { data: row };
  }

  async update(userId: string, userRole: Role, id: string, dto: UpdateCuratedPrayerDto) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();

    // Editors can edit only DRAFT/REVIEW they created; Moderators/SuperAdmin can edit any unless ARCHIVED
    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    if (!isElevated) {
      if (!owns) throw new ForbiddenException('You can only edit your own drafts');
      if (!(row.state === 'DRAFT' || row.state === 'REVIEW')) {
        throw new ForbiddenException('Only DRAFT/REVIEW items can be edited by editors');
      }
    }
    if (row.state === 'ARCHIVED' && !isElevated) {
      throw new ForbiddenException('Archived item cannot be edited by editor');
    }

    // if changing reference, check uniqueness
    if (dto.book || dto.chapter || dto.verse) {
      const book = dto.book ?? row.book;
      const chapter = dto.chapter ?? row.chapter;
      const verse = dto.verse ?? row.verse;
      const dupe = await this.prisma.curatedPrayer.findFirst({
        where: { book: { equals: book, mode: 'insensitive' }, chapter, verse, NOT: { id } },
        select: { id: true },
      });
      if (dupe) throw new BadRequestException('Another entry already exists for that reference');
    }

    const updated = await this.prisma.curatedPrayer.update({
      where: { id },
      data: { ...dto, updatedById: userId },
    });
    return { data: updated };
  }

  async transition(userId: string, userRole: Role, id: string, target: PublishState) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();

    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    if (target === 'REVIEW') {
      // submit for review: editor must own & from DRAFT
      if (!owns && !isElevated) throw new ForbiddenException('Only owner can submit');
      if (row.state !== 'DRAFT') throw new BadRequestException('Only DRAFT can be submitted to REVIEW');
      return this._setState(id, target, userId);
    }

    if (target === 'PUBLISHED') {
      if (!isElevated) throw new ForbiddenException('Only moderator/super admin can publish');
      if (row.state !== 'REVIEW' && row.state !== 'DRAFT') {
        throw new BadRequestException('Only DRAFT/REVIEW can be published');
      }
      return this._setState(id, target, userId, true);
    }

    if (target === 'ARCHIVED') {
      if (!isElevated) throw new ForbiddenException('Only moderator/super admin can archive');
      return this._setState(id, target, userId);
    }

    throw new BadRequestException('Invalid transition');
  }

  private async _setState(id: string, state: PublishState, userId: string, publish = false) {
    const data: any = { state, updatedById: userId };
    if (publish) data.publishedAt = new Date();
    return { data: await this.prisma.curatedPrayer.update({ where: { id }, data }) };
  }

  async remove(userId: string, userRole: Role, id: string) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    // Editors can delete only their own DRAFTs
    if (!isElevated) {
      if (!owns) throw new ForbiddenException('You can only delete your own drafts');
      if (row.state !== 'DRAFT') throw new ForbiddenException('Only DRAFT can be deleted by editor');
    }
    await this.prisma.savedPrayer.deleteMany({ where: { curatedPrayerId: id } });
    await this.prisma.curatedPrayer.delete({ where: { id } });
    return { ok: true };
  }
}
