import { Module } from '@nestjs/common';
import { SavedPrayersController } from './saved-prayers.controller';
import { SavedPrayersService } from './saved-prayers.service';

@Module({
  controllers: [SavedPrayersController],
  providers: [SavedPrayersService],
})
export class SavedPrayersModule {}
