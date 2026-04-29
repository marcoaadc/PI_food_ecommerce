import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  complement?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  district!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  state!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  postalCode!: string;

  @IsEnum(AddressType)
  @IsOptional()
  type?: AddressType;
}
