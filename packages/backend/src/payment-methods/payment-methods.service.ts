import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number, userId: number) {
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });

    if (!pm || !pm.isActive) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }
    if (pm.userId !== userId) {
      throw new ForbiddenException();
    }

    return pm;
  }

  async create(userId: number, dto: CreatePaymentMethodDto) {
    const lastFourDigits = dto.cardNumber.slice(-4);

    return this.prisma.paymentMethod.create({
      data: {
        userId,
        brand: dto.brand,
        lastFourDigits,
        expirationMonth: dto.expirationMonth,
        expirationYear: dto.expirationYear,
        holderName: dto.holderName,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findById(id, userId);
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { isActive: false, isSelected: false },
    });
  }

  async select(id: number, userId: number) {
    await this.findById(id, userId);

    await this.prisma.$transaction([
      this.prisma.paymentMethod.updateMany({
        where: { userId, isActive: true },
        data: { isSelected: false },
      }),
      this.prisma.paymentMethod.update({
        where: { id },
        data: { isSelected: true },
      }),
    ]);

    return this.prisma.paymentMethod.findUnique({ where: { id } });
  }
}
