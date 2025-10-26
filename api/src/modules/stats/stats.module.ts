import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [StatsController],
  providers: [PrismaService],
})
export class StatsModule {}
