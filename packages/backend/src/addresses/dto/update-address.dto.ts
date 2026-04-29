import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AddressType } from '@prisma/client';

export class UpdateAddressDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  street?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  number?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  complement?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  district?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  city?: string;

  @IsString()
  @MaxLength(2)
  @IsOptional()
  state?: string;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  postalCode?: string;

  @IsEnum(AddressType)
  @IsOptional()
  type?: AddressType;
}
