import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CuratedPrayersService } from './curated-prayers.service';
import type { Request } from 'express';

@Controller('browse/prayers')
export class CuratedPrayersController {
  constructor(private service: CuratedPrayersService) {}

  @Get()
  async list(
    @Req() req: Request,
    @Query('q') q?: string,
    @Query('book') book?: string,
    @Query('chapter') chapter?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    // @ts-ignore
    const userId: string | null = req.user?.id ?? null;
    const chap = chapter ? Number(chapter) : undefined;
    return this.service.list({ q, book, chapter: chap, limit: limit ? Number(limit) : undefined, cursor: cursor ?? null, userId });
  }

  @Get(':id')
  async byId(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    const userId: string | null = req.user?.id ?? null;
    const data = await this.service.byId(id, userId);
    if (!data) return { error: { code: 'NOT_FOUND', message: 'Not found' } };
    return { data };
  }
}
