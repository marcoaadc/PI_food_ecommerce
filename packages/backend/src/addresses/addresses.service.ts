import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.address.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number, userId: number) {
    const address = await this.prisma.address.findUnique({ where: { id } });

    if (!address || !address.isActive) {
      throw new NotFoundException('Endereço não encontrado');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException();
    }

    return address;
  }

  async create(userId: number, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: { ...dto, userId },
    });
  }

  async update(id: number, userId: number, dto: UpdateAddressDto) {
    await this.findById(id, userId);
    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    await this.findById(id, userId);
    return this.prisma.address.update({
      where: { id },
      data: { isActive: false, isSelected: false },
    });
  }

  async select(id: number, userId: number) {
    await this.findById(id, userId);

    await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { userId, isActive: true },
        data: { isSelected: false },
      }),
      this.prisma.address.update({
        where: { id },
        data: { isSelected: true },
      }),
    ]);

    return this.prisma.address.findUnique({ where: { id } });
  }
}
