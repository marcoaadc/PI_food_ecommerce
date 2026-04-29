import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(query.category && { category: query.category }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { category: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findCategories() {
    const categories = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map((c) => c.category);
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || !product.isActive) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
