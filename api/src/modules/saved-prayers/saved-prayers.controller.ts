import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
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
            id: true,
            book: true,
            chapter: true,
            verse: true,
            theme: true,
            scriptureText: true,
            insight: true,
            prayerPoints: true,
            closing: true,
            state: true,
            publishedAt: true,
          },
        },
      },
    });

    // shape the response the frontend expects
    return {
      data: rows.map((r) => ({
        id: r.id,
        curatedPrayerId: r.curatedPrayerId,
        createdAt: r.createdAt,
        curatedPrayer: r.curatedPrayer, // contains book/chapter/verse/etc
      })),
    };
  }

  @Post(':curatedPrayerId')
  async save(@Req() req: Request, @Param('curatedPrayerId') curatedPrayerId: string) {
  // @ts-ignore
    const userId = req.user.id as string;

    await this.prisma.savedPrayer.upsert({
      where: {
        // this name is auto-generated from @@unique([userId, curatedPrayerId])
        userId_curatedPrayerId: { userId, curatedPrayerId },
      },
      update: {},               // nothing to update; existence is the goal
      create: { userId, curatedPrayerId },
    });

    return { ok: true };
  }

  @Delete(':curatedPrayerId')
  async unsave(@Req() req: Request, @Param('curatedPrayerId') curatedPrayerId: string) {
    // @ts-ignore
    const userId = req.user.id as string;

    await this.prisma.savedPrayer.deleteMany({
      where: { userId, curatedPrayerId },
    });

    return { ok: true };
  }
}
