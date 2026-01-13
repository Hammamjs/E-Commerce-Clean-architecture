import { OrderItem } from '../entities/order-item.entity';

export interface IOrderItemsRepository {
  findItemById(itemId: string): Promise<OrderItem>;
  update(item: OrderItem): Promise<OrderItem>;
  createFromCart(orderId: string, cartId: string): Promise<OrderItem[]>;
  findByOrdersId(orderIds: string[]): Promise<OrderItem[]>;
}
