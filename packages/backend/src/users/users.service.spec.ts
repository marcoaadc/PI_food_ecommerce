import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    role: 'CUSTOMER',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(result.email).toBe('test@test.com');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash the password when updating', async () => {
      prisma.user.update.mockResolvedValue(mockUser);

      await service.update(1, { password: 'NewPass1' });

      const updateCall = prisma.user.update.mock.calls[0]![0]!;
      const hashedPassword = (updateCall as { data: { password: string } }).data
        .password;

      expect(hashedPassword).not.toBe('NewPass1');
      expect(await bcrypt.compare('NewPass1', hashedPassword)).toBe(true);
    });

    it('should update name when provided', async () => {
      prisma.user.update.mockResolvedValue({ ...mockUser, name: 'Novo Nome' });

      await service.update(1, { name: 'Novo Nome' });

      const updateCall = prisma.user.update.mock.calls[0]![0]!;
      const data = (updateCall as { data: Record<string, unknown> }).data;
      expect(data.name).toBe('Novo Nome');
    });

    it('should include name in data when dto.name is an empty string', async () => {
      prisma.user.update.mockResolvedValue(mockUser);

      await service.update(1, { name: '' });

      const updateCall = prisma.user.update.mock.calls[0]![0]!;
      const data = (updateCall as { data: Record<string, unknown> }).data;
      expect(data).toHaveProperty('name');
      expect(data.name).toBe('');
    });

    it('should not include name in data when dto.name is undefined', async () => {
      prisma.user.update.mockResolvedValue(mockUser);

      await service.update(1, {});

      const updateCall = prisma.user.update.mock.calls[0]![0]!;
      const data = (updateCall as { data: Record<string, unknown> }).data;
      expect(data).not.toHaveProperty('name');
    });

    it('should not include password in data when not provided', async () => {
      prisma.user.update.mockResolvedValue(mockUser);

      await service.update(1, { name: 'Novo Nome' });

      const updateCall = prisma.user.update.mock.calls[0]![0]!;
      const data = (updateCall as { data: Record<string, unknown> }).data;
      expect(data).not.toHaveProperty('password');
    });
  });
});
