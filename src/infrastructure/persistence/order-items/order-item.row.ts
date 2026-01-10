import { ItemStatus } from 'src/domain/enums/order-item-status.enum';

export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  createdAt: Date;
  status: ItemStatus;
}
