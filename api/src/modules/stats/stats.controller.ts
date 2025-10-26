import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtCookieAuthGuard) // keep consistent with the rest of the app
@Controller('stats')
export class StatsController {
  constructor(private prisma: PrismaService) {}

  @Get('users-count')
  async usersCount() {
    const count = await this.prisma.user.count();
    return { count };
  }
}
