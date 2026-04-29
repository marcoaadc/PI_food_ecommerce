import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(private readonly pmService: PaymentMethodsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.pmService.findAllByUser(userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.pmService.create(userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.pmService.remove(id, userId);
  }

  @Post(':id/select')
  select(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.pmService.select(id, userId);
  }
}
