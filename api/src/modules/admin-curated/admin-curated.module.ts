import { Module } from '@nestjs/common';
import { AdminCuratedController } from './admin-curated.controller';
import { AdminCuratedService } from './admin-curated.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminCuratedController],
  providers: [AdminCuratedService],
})
export class AdminCuratedModule {}
