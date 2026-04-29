import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle([{ ttl: 60000, limit: 3 }])
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post('login')
  @Throttle([{ ttl: 60000, limit: 5 }])
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: { id: number; email: string; role: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(user.id, user.email, user.role);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { message: 'Logout realizado' };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
