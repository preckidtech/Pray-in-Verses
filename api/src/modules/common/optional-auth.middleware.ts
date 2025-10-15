import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

const COOKIE_NAME = 'access_token';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = (req as any).cookies?.[COOKIE_NAME];
      if (token) {
        const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET });
        (req as any).user = { id: payload.sub, role: payload.role };
      }
    } catch {}
    next();
  }
}
