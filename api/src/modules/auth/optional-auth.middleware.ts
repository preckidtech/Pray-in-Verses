import { Injectable, NestMiddleware } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {Request, Response, NextFunction} from "express";

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwt: JwtService) {}
    async use (req: Request, _res: Response, next: NextFunction) {
        const token = (req as any).cookies?.access_token;
        if (!token) return next();
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: process.env.JWT_SECRET });
                ( req as any).user = { id: payload.sub, role: payload.role};
        } catch {}
        next();

    }
}