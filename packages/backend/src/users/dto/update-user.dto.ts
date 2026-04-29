import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
