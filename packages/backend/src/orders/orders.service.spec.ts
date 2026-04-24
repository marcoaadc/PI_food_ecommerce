import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockAddress = { findFirst: jest.fn() };
  const mockPaymentMethod = { findFirst: jest.fn() };
  const mockProduct = { findMany: jest.fn(), update: jest.fn() };
  const mockOrder = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const mock$transaction = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            address: mockAddress,
            paymentMethod: mockPaymentMethod,
            product: mockProduct,
            order: mockOrder,
            $transaction: mock$transaction,
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw when no address is selected', async () => {
      mockAddress.findFirst.mockResolvedValue(null);

      await expect(
        service.create(1, { items: [{ productId: 1, quantity: 1 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when no payment method is selected', async () => {
      mockAddress.findFirst.mockResolvedValue({ id: 1 });
      mockPaymentMethod.findFirst.mockResolvedValue(null);

      await expect(
        service.create(1, { items: [{ productId: 1, quantity: 1 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when product not found', async () => {
      mockAddress.findFirst.mockResolvedValue({ id: 1 });
      mockPaymentMethod.findFirst.mockResolvedValue({ id: 1 });
      mockProduct.findMany.mockResolvedValue([]);

      await expect(
        service.create(1, { items: [{ productId: 999, quantity: 1 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when stock insufficient', async () => {
      mockAddress.findFirst.mockResolvedValue({ id: 1 });
      mockPaymentMethod.findFirst.mockResolvedValue({ id: 1 });
      mockProduct.findMany.mockResolvedValue([
        { id: 1, name: 'Burger', price: new Prisma.Decimal(18.9), stock: 2, isActive: true },
      ]);

      await expect(
        service.create(1, { items: [{ productId: 1, quantity: 5 }] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should throw for invalid transition', async () => {
      mockOrder.findUnique.mockResolvedValue({
        id: 1,
        status: 'DELIVERED',
        isActive: true,
      });

      await expect(
        service.updateStatus(1, 'PREPARING' as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existent order', async () => {
      mockOrder.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus(999, 'DELIVERED' as never)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
