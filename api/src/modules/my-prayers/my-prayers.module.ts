import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MyPrayersController } from './my-prayers.controller';
import { MyPrayersService } from './my-prayers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MyPrayersController],
  providers: [MyPrayersService],
})
export class MyPrayersModule {}
