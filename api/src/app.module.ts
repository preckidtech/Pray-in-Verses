import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CuratedPrayersModule } from './modules/curated-prayers/curated-prayers.module';

@Module({
  imports: [PrismaModule, AuthModule, CuratedPrayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
