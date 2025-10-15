import { Module } from '@nestjs/common';
import { CuratedPrayersController } from './curated-prayers.controller';
import { CuratedPrayersService } from './curated-prayers.service';

@Module({
  controllers: [CuratedPrayersController],
  providers: [CuratedPrayersService],
  exports: [CuratedPrayersService],
})
export class CuratedPrayersModule {}
