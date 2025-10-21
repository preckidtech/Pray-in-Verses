import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminCuratedService } from './admin-curated.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCuratedPrayerDto, ListQuery, TransitionDto, UpdateCuratedPrayerDto } from './dto';
import type { Request } from 'express';
import { PublishState } from '@prisma/client';

@UseGuards(JwtCookieAuthGuard, RolesGuard)
@Roles('EDITOR','MODERATOR','SUPER_ADMIN')
@Controller('admin/curated-prayers')
export class AdminCuratedController {
  constructor(private service: AdminCuratedService) {}

  @Get()
  async list(
    @Req() req: Request,
    @Query('q') q?: string,
    @Query('state') state?: PublishState | string,
    @Query('book') book?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    // @ts-ignore
    const role = req.user.role;
    return this.service.list(role, q, state, book, limit ? Number(limit) : 20, cursor ?? null);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateCuratedPrayerDto) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.create(userId, dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateCuratedPrayerDto) {
    // @ts-ignore
    const userId = req.user.id as string;
    // @ts-ignore
    const role = req.user.role;
    return this.service.update(userId, role, id, dto);
  }

  @Post(':id/transition')
  async transition(@Req() req: Request, @Param('id') id: string, @Body() body: TransitionDto) {
    // @ts-ignore
    const userId = req.user.id as string;
    // @ts-ignore
    const role = req.user.role;
    return this.service.transition(userId, role, id, body.target as PublishState);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    // @ts-ignore
    const role = req.user.role;
    return this.service.remove(userId, role, id);
  }
}
