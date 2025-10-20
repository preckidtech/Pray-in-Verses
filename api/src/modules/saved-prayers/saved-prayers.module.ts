import { Module } from '@nestjs/common';
import { SavedPrayersController } from './saved-prayers.controller';
import { SavedPrayersService } from './saved-prayers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // for JwtCookieAuthGuard + JwtService
  controllers: [SavedPrayersController],
  providers: [SavedPrayersService],
})
export class SavedPrayersModule {}
