import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CardBrand } from '@prisma/client';

export class CreatePaymentMethodDto {
  @IsEnum(CardBrand)
  brand!: CardBrand;

  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @IsInt()
  @Min(1)
  @Max(12)
  expirationMonth!: number;

  @IsInt()
  @Min(2024)
  expirationYear!: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  cvv!: string;

  @IsString()
  @IsNotEmpty()
  holderName!: string;
}
