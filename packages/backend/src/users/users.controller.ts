import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: number) {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
  }
}
