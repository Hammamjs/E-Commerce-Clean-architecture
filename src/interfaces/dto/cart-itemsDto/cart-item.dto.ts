export class CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
}
