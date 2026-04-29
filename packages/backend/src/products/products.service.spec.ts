import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, name: 'Burger' }]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by category', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ category: 'Pizzas' });

      const whereArg = prisma.product.findMany.mock.calls[0]![0]!.where;
      expect(whereArg.category).toBe('Pizzas');
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, name: 'X-Burguer', isActive: true });

      const result = await service.findById(1);
      expect(result.name).toBe('X-Burguer');
    });

    it('should throw NotFoundException for inactive product', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, isActive: false });

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete by setting isActive to false', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, isActive: true });
      prisma.product.update.mockResolvedValue({ id: 1, isActive: false });

      await service.remove(1);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });
    });
  });
});
