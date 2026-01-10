import { ItemStatus } from './order-items-status';

export class OrderItemsResponse {
  constructor(
    public id: string,
    public orderId: string,
    public productId: string,
    public unitPrice: number,
    public quantity: number,
    public createdAt: Date,
    public status: ItemStatus,
  ) {}
}
