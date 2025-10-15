import { Controller, Delete, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { SavedPrayersService } from './saved-prayers.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtCookieAuthGuard)
@Controller('saved-prayers')
export class SavedPrayersController {
  constructor(private service: SavedPrayersService) {}

  @Get()
  async list(@Req() req: Request, @Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.list(userId, limit ? Number(limit) : 20, cursor ?? null);
  }

  @Post(':curatedPrayerId')
  async save(@Req() req: Request, @Param('curatedPrayerId') id: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.save(userId, id);
  }

  @Delete(':curatedPrayerId')
  async unsave(@Req() req: Request, @Param('curatedPrayerId') id: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.unsave(userId, id);
  }
}
