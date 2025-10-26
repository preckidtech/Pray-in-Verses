import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrayerWallService } from './prayer-wall.service';
import { PrayerWallController } from './prayer-wall.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ AuthModule],
  controllers: [PrayerWallController],
  providers: [PrayerWallService, PrismaService],
})
export class PrayerWallModule {}
