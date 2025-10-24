import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCuratedPrayerDto, UpdateCuratedPrayerDto } from './dto';
import { PublishState, Role } from '@prisma/client';

@Injectable()
export class AdminCuratedService {
  constructor(private prisma: PrismaService) {}

  async list(
    userRole: Role,
    q?: string,
    state?: PublishState | string,
    book?: string,
    limit = 20,
    cursor?: string | null,
  ) {
    const where: any = {};
    if (book) where.book = { equals: book, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { theme: { contains: q, mode: 'insensitive' } },
        { scriptureText: { contains: q, mode: 'insensitive' } },
        { insight: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (state) where.state = state;

    const rows = await this.prisma.curatedPrayer.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: [{ state: 'asc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        book: true,
        chapter: true,
        verse: true,
        theme: true,
        state: true,
        updatedAt: true,
        publishedAt: true,
        createdById: true,
        updatedById: true,
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
      if (e.code === 'P2002') {
        // Assuming @@unique([book, chapter, verse]) in schema
        throw new BadRequestException(
          'A curated entry already exists for this book/chapter/verse.',
        );
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

    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    // Editors can edit only DRAFT/REVIEW they created
    if (!isElevated) {
      if (!owns) throw new ForbiddenException('You can only edit your own drafts');
      if (!(row.state === 'DRAFT' || row.state === 'REVIEW')) {
        throw new ForbiddenException('Only DRAFT/REVIEW items can be edited by editors');
      }
    }
    if (row.state === 'ARCHIVED' && !isElevated) {
      throw new ForbiddenException('Archived item cannot be edited by editor');
    }

    // if changing reference, keep it unique
    if (dto.book || dto.chapter || dto.verse) {
      const book = dto.book ?? row.book;
      const chapter = dto.chapter ?? row.chapter;
      const verse = dto.verse ?? row.verse;
      const dupe = await this.prisma.curatedPrayer.findFirst({
        where: {
          book: { equals: book, mode: 'insensitive' },
          chapter,
          verse,
          NOT: { id },
        },
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

  /**
   * Publish preconditions – all the content fields must be present.
   */
  private ensurePublishPreconditions(row: {
    book?: string;
    chapter?: number;
    verse?: number;
    theme?: string;
    scriptureText?: string;
    insight?: string;
    closing?: string;
    prayerPoints?: string[];
  }) {
    const errs: string[] = [];
    if (!row.book) errs.push('book');
    if (!row.chapter) errs.push('chapter');
    if (!row.verse) errs.push('verse');
    if (!row.theme?.trim()) errs.push('theme');
    if (!row.scriptureText?.trim()) errs.push('scriptureText');
    if (!row.insight?.trim()) errs.push('insight');
    if (!row.closing?.trim()) errs.push('closing');
    if (!row.prayerPoints || row.prayerPoints.length === 0) errs.push('prayerPoints (at least one)');
    if (errs.length) {
      throw new BadRequestException(
        `Cannot publish: missing/empty fields → ${errs.join(', ')}`
      );
    }
  }

  async transition(userId: string, userRole: Role, id: string, target: PublishState) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();

    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    // --- REVIEW ---
    if (target === 'REVIEW') {
      // Case A: submit DRAFT → REVIEW (owner or elevated)
      if (row.state === 'DRAFT') {
        if (!owns && !isElevated) throw new ForbiddenException('Only the owner can submit draft to review');
        return this._setState(id, 'REVIEW', userId);
      }
      // Case B: unpublish PUBLISHED → REVIEW (elevated only)
      if (row.state === 'PUBLISHED') {
        if (!isElevated) throw new ForbiddenException('Only moderator/super admin can unpublish');
        return this._setState(id, 'REVIEW', userId, false /* publishFlag */);
      }
      // Already in REVIEW – no-op
      if (row.state === 'REVIEW') {
        return { data: row };
      }
      // ARCHIVED → REVIEW (restore; elevated only)
      if (row.state === 'ARCHIVED') {
        if (!isElevated) throw new ForbiddenException('Only moderator/super admin can restore from archive');
        return this._setState(id, 'REVIEW', userId);
      }
      throw new BadRequestException(`Invalid transition: ${row.state} → REVIEW`);
    }

    // --- PUBLISHED ---
    if (target === 'PUBLISHED') {
      if (!isElevated) throw new ForbiddenException('Only moderator/super admin can publish');
      if (!(row.state === 'REVIEW' || row.state === 'DRAFT')) {
        throw new BadRequestException('Only DRAFT/REVIEW can be published');
      }

      // Preconditions
      this.ensurePublishPreconditions(row);

      // If your schema allows multiple rows per reference, enforce uniqueness for PUBLISHED here.
      // (If you already have @@unique([book, chapter, verse]), this is redundant but harmless.)
      const conflict = await this.prisma.curatedPrayer.findFirst({
        where: {
          state: 'PUBLISHED',
          book: { equals: row.book, mode: 'insensitive' },
          chapter: row.chapter,
          verse: row.verse,
          NOT: { id: row.id },
        },
        select: { id: true },
      });
      if (conflict) {
        throw new BadRequestException(
          `Another published entry already exists for ${row.book} ${row.chapter}:${row.verse}. Unpublish it first.`
        );
      }

      return this._setState(id, 'PUBLISHED', userId, true /* publishFlag */);
    }

    // --- ARCHIVED ---
    if (target === 'ARCHIVED') {
      if (!isElevated) throw new ForbiddenException('Only moderator/super admin can archive');
      return this._setState(id, 'ARCHIVED', userId);
    }

    throw new BadRequestException(
      'Invalid transition. Allowed targets are: REVIEW, PUBLISHED, ARCHIVED',
    );
  }

  private async _setState(
    id: string,
    state: PublishState,
    userId: string,
    publish = false,
  ) {
    const data: any = { state, updatedById: userId, updatedAt: new Date() };
    if (publish) {
      // set first publish timestamp if not yet set
      data.publishedAt = new Date();
    } else if (state === 'REVIEW') {
      // optional: keep publishedAt as historical, or null it out – choose your policy.
      // data.publishedAt = null;
    }
    const updated = await this.prisma.curatedPrayer.update({ where: { id }, data });
    return { data: updated, ok: true };
  }

  async remove(userId: string, userRole: Role, id: string) {
    const row = await this.prisma.curatedPrayer.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();

    const isElevated = userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
    const owns = row.createdById === userId;

    // Editors can delete only their own DRAFTs
    if (!isElevated) {
      if (!owns) throw new ForbiddenException('You can only delete your own drafts');
      if (row.state !== 'DRAFT') {
        throw new ForbiddenException('Only DRAFT can be deleted by editor');
      }
    }

    await this.prisma.savedPrayer.deleteMany({ where: { curatedPrayerId: id } });
    await this.prisma.curatedPrayer.delete({ where: { id } });
    return { ok: true };
  }
}
