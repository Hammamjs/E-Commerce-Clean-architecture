import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  total: number;

  @IsOptional()
  unitPrice: number;
}
