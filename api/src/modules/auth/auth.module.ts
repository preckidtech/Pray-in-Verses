import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCookieAuthGuard } from './jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtCookieAuthGuard],
  exports: [JwtModule, JwtCookieAuthGuard],
})
export class AuthModule {}
