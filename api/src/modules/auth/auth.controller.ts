import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtCookieAuthGuard } from './jwt.guard';

const COOKIE_NAME = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private jwt: JwtService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.auth.login(dto);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true in production behind HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME);
    return { ok: true };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    // @ts-ignore
    return this.auth.me(req.user.id);
  }
}
