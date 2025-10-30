import { Controller, Get, Post, Delete, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtCookieAuthGuard)
@Controller('saved-prayers')
export class SavedPrayersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user.id as string;

    const rows = await this.prisma.savedPrayer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        curatedPrayer: {
          select: {
            id: true, book: true, chapter: true, verse: true, theme: true,
            scriptureText: true, insight: true, prayerPoints: true, closing: true,
            state: true, publishedAt: true,
          },
        },
      },
    });

    return {
      data: rows.map((r) => ({
        id: r.id,
        curatedPrayerId: r.curatedPrayerId,
        pointIndex: r.pointIndex,        // 👈 include which point (if any)
        createdAt: r.createdAt,
        curatedPrayer: r.curatedPrayer,
      })),
    };
  }

  /** Legacy: save whole entry (pointIndex = null) */
  @Post(':curatedPrayerId')
  async save(@Req() req: Request, @Param('curatedPrayerId') curatedPrayerId: string) {
    // @ts-ignore
    const userId = req.user.id as string;

    // With the new @@unique([userId, curatedPrayerId, pointIndex]),
    // upsert needs the full composite. We emulate “ensure exists”.
    await this.prisma.savedPrayer.create({
      data: { userId, curatedPrayerId, pointIndex: null },
    }).catch((e) => {
      // duplicate → no-op
      if (e?.code !== 'P2002') throw e;
    });

    return { ok: true };
  }

  /** Save a specific prayer point by index (0-based) */
  @Post(':curatedPrayerId/points/:index')
  async savePoint(
    @Req() req: Request,
    @Param('curatedPrayerId') curatedPrayerId: string,
    @Param('index') index: string,
  ) {
    // @ts-ignore
    const userId = req.user.id as string;
    const idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0) throw new BadRequestException('Invalid index');

    await this.prisma.savedPrayer.create({
      data: { userId, curatedPrayerId, pointIndex: idx },
    }).catch((e) => {
      if (e?.code !== 'P2002') throw e; // duplicate → no-op
    });

    return { ok: true };
  }

  /** Unsave whole entry */
  @Delete(':curatedPrayerId')
  async unsave(@Req() req: Request, @Param('curatedPrayerId') curatedPrayerId: string) {
    // @ts-ignore
    const userId = req.user.id as string;

    await this.prisma.savedPrayer.deleteMany({
      where: { userId, curatedPrayerId, pointIndex: null },
    });

    return { ok: true };
  }

  /** Unsave a specific prayer point */
  @Delete(':curatedPrayerId/points/:index')
  async unsavePoint(
    @Req() req: Request,
    @Param('curatedPrayerId') curatedPrayerId: string,
    @Param('index') index: string,
  ) {
    // @ts-ignore
    const userId = req.user.id as string;
    const idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0) throw new BadRequestException('Invalid index');

    await this.prisma.savedPrayer.deleteMany({
      where: { userId, curatedPrayerId, pointIndex: idx },
    });

    return { ok: true };
  }
}
