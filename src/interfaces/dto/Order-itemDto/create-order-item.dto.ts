export class CreateOrderItemDto {
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  status?: 'ordered' | 'canceled' | 'confirmed';
}
