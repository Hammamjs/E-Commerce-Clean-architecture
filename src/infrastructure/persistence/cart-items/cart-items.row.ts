import { IsPositive, IsUUID } from 'class-validator';

export class CartItemsRow {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @IsPositive()
  quantity: number;

  unitPrice: number;
  createdAt: string;
  total: number;
}
