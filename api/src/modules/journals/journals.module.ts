import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';

@Module({
  imports: [JwtModule.register({})],          // <-- add
  controllers: [JournalsController],
  providers: [JournalsService, JwtCookieAuthGuard], // <-- add guard
})
export class JournalsModule {}
