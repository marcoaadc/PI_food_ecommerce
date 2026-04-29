import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let prisma: {
    paymentMethod: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const mockPaymentMethod = {
    id: 1,
    userId: 10,
    brand: 'VISA',
    lastFourDigits: '4321',
    expirationMonth: 12,
    expirationYear: 2026,
    holderName: 'Joao Silva',
    isActive: true,
    isSelected: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      paymentMethod: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentMethodsService>(PaymentMethodsService);
  });

  describe('create', () => {
    it('should store only the last 4 digits of the card number', async () => {
      const dto = {
        brand: 'VISA' as const,
        cardNumber: '4111111111114321',
        expirationMonth: 12,
        expirationYear: 2026,
        cvv: '123',
        holderName: 'Joao Silva',
      };

      prisma.paymentMethod.create.mockResolvedValue(mockPaymentMethod);

      await service.create(10, dto);

      expect(prisma.paymentMethod.create).toHaveBeenCalledWith({
        data: {
          userId: 10,
          brand: 'VISA',
          lastFourDigits: '4321',
          expirationMonth: 12,
          expirationYear: 2026,
          holderName: 'Joao Silva',
        },
      });
    });

    it('should not store the full card number or cvv', async () => {
      const dto = {
        brand: 'MASTERCARD' as const,
        cardNumber: '5500000000005678',
        expirationMonth: 6,
        expirationYear: 2025,
        cvv: '456',
        holderName: 'Maria Santos',
      };

      prisma.paymentMethod.create.mockResolvedValue({
        ...mockPaymentMethod,
        lastFourDigits: '5678',
      });

      await service.create(10, dto);

      const createCall = prisma.paymentMethod.create.mock.calls[0]![0]!;
      const data = createCall.data as Record<string, unknown>;
      expect(data).not.toHaveProperty('cardNumber');
      expect(data).not.toHaveProperty('cvv');
      expect(data.lastFourDigits).toBe('5678');
    });
  });

  describe('findById', () => {
    it('should return payment method when user is the owner', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      const result = await service.findById(1, 10);

      expect(result.id).toBe(1);
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      await expect(service.findById(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when payment method does not exist', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(null);

      await expect(service.findById(999, 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when payment method is inactive', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue({
        ...mockPaymentMethod,
        isActive: false,
      });

      await expect(service.findById(1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllByUser', () => {
    it('should return only active payment methods for the user', async () => {
      prisma.paymentMethod.findMany.mockResolvedValue([mockPaymentMethod]);

      const result = await service.findAllByUser(10);

      expect(result).toHaveLength(1);
      expect(prisma.paymentMethod.findMany).toHaveBeenCalledWith({
        where: { userId: 10, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException when removing payment method of another user', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      await expect(service.remove(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should soft delete payment method for the owner', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);
      prisma.paymentMethod.update.mockResolvedValue({
        ...mockPaymentMethod,
        isActive: false,
        isSelected: false,
      });

      await service.remove(1, 10);

      expect(prisma.paymentMethod.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false, isSelected: false },
      });
    });
  });
});
