import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import { JournalsService } from './journals.service';
import { CreateJournalDto, UpdateJournalDto } from './dto';

@UseGuards(JwtCookieAuthGuard)
@Controller('journals')
export class JournalsController {
  constructor(private service: JournalsService) {}

  @Get()
  async list(
    @Req() req: Request,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.list(userId, q, limit ? Number(limit) : 20, cursor ?? null);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateJournalDto) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.create(userId, dto);
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.get(userId, id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateJournalDto) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    const userId = req.user.id as string;
    return this.service.remove(userId, id);
  }
}
