import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AddressesService } from './addresses.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AddressesService', () => {
  let service: AddressesService;
  let prisma: {
    address: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const mockAddress = {
    id: 1,
    userId: 10,
    street: 'Rua Teste',
    number: '123',
    district: 'Centro',
    city: 'Sao Paulo',
    state: 'SP',
    postalCode: '01000-000',
    isActive: true,
    isSelected: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      address: {
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
        AddressesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  describe('findAllByUser', () => {
    it('should return only addresses belonging to the user', async () => {
      prisma.address.findMany.mockResolvedValue([mockAddress]);

      const result = await service.findAllByUser(10);

      expect(result).toHaveLength(1);
      expect(prisma.address.findMany).toHaveBeenCalledWith({
        where: { userId: 10, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('should return address when user is the owner', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);

      const result = await service.findById(1, 10);

      expect(result.id).toBe(1);
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);

      await expect(service.findById(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when address does not exist', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      await expect(service.findById(999, 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when address is inactive', async () => {
      prisma.address.findUnique.mockResolvedValue({
        ...mockAddress,
        isActive: false,
      });

      await expect(service.findById(1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create address with the given userId', async () => {
      const dto = {
        street: 'Rua Nova',
        number: '456',
        district: 'Jardim',
        city: 'Sao Paulo',
        state: 'SP',
        postalCode: '02000-000',
      };
      prisma.address.create.mockResolvedValue({ id: 2, userId: 10, ...dto });

      const result = await service.create(10, dto);

      expect(result.userId).toBe(10);
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 10 },
      });
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException when updating address of another user', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);

      await expect(
        service.update(1, 999, { street: 'Rua Alterada' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update address when user is the owner', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);
      prisma.address.update.mockResolvedValue({
        ...mockAddress,
        street: 'Rua Alterada',
      });

      const result = await service.update(1, 10, { street: 'Rua Alterada' });

      expect(result.street).toBe('Rua Alterada');
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException when removing address of another user', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);

      await expect(service.remove(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should soft delete address for the owner', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);
      prisma.address.update.mockResolvedValue({
        ...mockAddress,
        isActive: false,
        isSelected: false,
      });

      await service.remove(1, 10);

      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false, isSelected: false },
      });
    });
  });
});
