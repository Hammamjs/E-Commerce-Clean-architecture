import { OrderItemsResponse } from '../Order-itemDto/order-item-response';
import { OrderResponse } from '../orderDto/order-response';

export class CheckOutResponse {
  constructor(
    public order: OrderResponse,
    public items: OrderItemsResponse[],
  ) {
    this.order = order;
    this.items = items;
  }
}
