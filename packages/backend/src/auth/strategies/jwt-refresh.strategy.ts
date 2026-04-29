import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from './jwt.strategy.js';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['refresh_token'] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  validate(payload: JwtPayload) {
    if (!Object.values(UserRole).includes(payload.role as UserRole)) {
      throw new UnauthorizedException('Role inválida no token');
    }

    return { id: payload.sub, email: payload.email, role: payload.role as UserRole };
  }
}
