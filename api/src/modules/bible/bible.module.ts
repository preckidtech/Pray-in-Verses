import { Module } from '@nestjs/common';
import { BibleService } from './bible.service';
import { BibleController } from './bible.controller';
import { AuthModule } from '../auth/auth.module'; // ⬅️ import the module that exports JwtModule & guards

@Module({
  imports: [AuthModule], // ⬅️ critical
  providers: [BibleService],
  controllers: [BibleController],
})
export class BibleModule {}
