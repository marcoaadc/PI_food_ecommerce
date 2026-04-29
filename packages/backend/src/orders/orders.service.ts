import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  PREPARING: OrderStatus.OUT_FOR_DELIVERY,
  OUT_FOR_DELIVERY: OrderStatus.DELIVERED,
  DELIVERED: null,
  CANCELLED: null,
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { userId, isSelected: true, isActive: true },
    });
    if (!address) {
      throw new BadRequestException('Selecione um endereço de entrega');
    }

    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { userId, isSelected: true, isActive: true },
    });
    if (!paymentMethod) {
      throw new BadRequestException('Selecione um método de pagamento');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não encontrados');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let total = new Prisma.Decimal(0);
    const orderItems: {
      productId: number;
      quantity: number;
      unitPrice: Prisma.Decimal;
      productName: string;
    }[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para "${product.name}" (disponível: ${product.stock})`,
        );
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        productName: product.name,
      });

      total = total.add(product.price.mul(item.quantity));
    }

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          paymentMethodId: paymentMethod.id,
          total,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId, isActive: true },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        isActive: true,
        ...(status && { status }),
      },
      include: {
        items: true,
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        paymentMethod: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order || !order.isActive) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async findByIdForUser(id: number, userId: number, userRole: string) {
    const order = await this.findById(id);

    if (userRole !== 'SHOPKEEPER' && order.userId !== userId) {
      throw new ForbiddenException('Acesso negado a este pedido');
    }

    return order;
  }

  async updateStatus(id: number, newStatus: OrderStatus) {
    const order = await this.findById(id);

    const expectedNext = VALID_TRANSITIONS[order.status];
    if (newStatus !== expectedNext && newStatus !== OrderStatus.CANCELLED) {
      throw new BadRequestException(
        `Transição inválida: ${order.status} → ${newStatus}`,
      );
    }

    const data: Record<string, unknown> = { status: newStatus };
    if (newStatus === OrderStatus.OUT_FOR_DELIVERY) {
      data.completedAt = new Date();
    }
    if (newStatus === OrderStatus.DELIVERED) {
      data.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  async cancel(id: number) {
    return this.updateStatus(id, OrderStatus.CANCELLED);
  }
}
