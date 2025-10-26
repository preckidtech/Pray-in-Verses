// src/modules/prayer-wall/prayer-wall.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import { PrayerWallService } from './prayer-wall.service';
import { CreatePrayerRequestDto, AddCommentDto } from './dto';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtCookieAuthGuard)
@Controller('prayer-wall') // <-- was 'wall'
export class PrayerWallController {
  constructor(
    private service: PrayerWallService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePrayerRequestDto) {
    // @ts-ignore
    return this.service.create(req.user.id, dto);
  }

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '20',
  ) {
    return this.service.list(
      q,
      category,
      cursor ?? null,
      Math.min(Number(limit) || 20, 50),
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post(':id/like')
  async toggleLike(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.service.toggleLike(req.user.id, id);
  }

  @Post(':id/bookmark')
  async toggleBookmark(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.service.toggleBookmark(req.user.id, id);
  }

  @Post(':id/comments')
  async addComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AddCommentDto,
  ) {
    // @ts-ignore
    return this.service.addComment(req.user.id, id, dto.body);
  }

  @Delete('comments/:commentId')
  async removeComment(@Req() req: Request, @Param('commentId') commentId: string) {
    // @ts-ignore
    return this.service.removeComment(req.user.id, commentId);
  }

  // Optional helper for the header banner
  @Get('stats')
  async stats() {
    const [users, requests] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.prayerRequest.count(),
    ]);
    return { users, requests };
  }
}
