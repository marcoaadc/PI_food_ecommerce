import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let jwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwt = { signAsync: jest.fn().mockResolvedValue('mock-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, string> = {
                'jwt.accessSecret': 'test-access-secret-32-chars-long!',
                'jwt.refreshSecret': 'test-refresh-secret-32-chars-long',
                'jwt.accessExpiration': '15m',
                'jwt.refreshExpiration': '7d',
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create user with hashed password', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        role: 'CUSTOMER',
        password: 'hashed',
      });

      const result = await service.register({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBe('mock-token');

      const createCall = prisma.user.create.mock.calls[0]![0]!;
      const hashedPassword = (createCall as { data: { password: string } }).data.password;
      expect(await bcrypt.compare('123456', hashedPassword)).toBe(true);
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        service.register({ name: 'Test', email: 'existing@test.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const hashed = await bcrypt.hash('123456', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        password: hashed,
        role: 'CUSTOMER',
      });

      const result = await service.login({ email: 'test@test.com', password: '123456' });
      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashed,
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
