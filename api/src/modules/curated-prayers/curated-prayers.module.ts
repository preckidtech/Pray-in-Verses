import { Module } from '@nestjs/common';
import { CuratedPrayersController } from './curated-prayers.controller';
import { CuratedPrayersService } from './curated-prayers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CuratedPrayersController],
  providers: [CuratedPrayersService],
  exports: [CuratedPrayersService],
})
export class CuratedPrayersModule {}
