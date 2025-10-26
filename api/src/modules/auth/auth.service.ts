import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, LoginDto } from './dto';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

const RESET_TTL_MINUTES = 60;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private mail: MailService,) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, displayName: dto.displayName },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true },
    });
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    const token = await this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

    // Return public user fields + token (we’ll set cookie in controller)
    const pub = { id: user.id, email: user.email, displayName: user.displayName, role: user.role };
    return { token, user: pub };
  }

  async createPasswordReset(email: string) {
  const user = await this.prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (!user) return; // silent success to prevent enumeration

  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  await this.prisma.passwordReset.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${appBase}/reset-password?token=${rawToken}`;

  await this.mail.sendPasswordReset(user.email, resetUrl).catch(() => undefined);
}

  // 2) Reset password using token
  async resetPasswordWithToken(rawToken: string, newPassword: string) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!reset) {
      throw new BadRequestException('Invalid or expired token.');
    }

    // Update user password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true },
    });
    return user;
  }
}
