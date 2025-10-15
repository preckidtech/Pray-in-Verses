import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SavedPrayersController } from './saved-prayers.controller';
import { SavedPrayersService } from './saved-prayers.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';

@Module({
  imports: [JwtModule.register({})],          // <-- add
  controllers: [SavedPrayersController],
  providers: [SavedPrayersService, JwtCookieAuthGuard], // <-- add guard
})
export class SavedPrayersModule {}