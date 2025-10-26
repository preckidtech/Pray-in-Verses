import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import { MyPrayersService } from './my-prayers.service';
import { CreatePrayerPointDto, UpdatePrayerPointDto } from './dto';
import type { Request } from 'express';
import { PrayerStatus } from '@prisma/client';

@UseGuards(JwtCookieAuthGuard)
@Controller('my-prayers')
export class MyPrayersController {
  constructor(private service: MyPrayersService) {}

  @Get('stats')
  async stats(@Req() req: Request) {
    // @ts-ignore
    return this.service.stats(req.user.id);
  }

  @Get()
  async list(
    @Req() req: Request,
    @Query('q') q?: string,
    @Query('status') status?: 'ALL' | PrayerStatus,
  ) {
    // @ts-ignore
    return this.service.list(req.user.id, q, (status as any) ?? 'ALL');
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.service.get(req.user.id, id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePrayerPointDto) {
    // @ts-ignore
    return this.service.create(req.user.id, dto);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePrayerPointDto) {
    // @ts-ignore
    return this.service.update(req.user.id, id, dto);
  }

  @Post(':id/toggle')
  async toggle(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.service.toggle(req.user.id, id);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.service.remove(req.user.id, id);
  }
}
