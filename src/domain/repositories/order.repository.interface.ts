import { Orders } from '../entities/orders.entity';
import { Status } from '../enums/order-status.enum';

type OrderOrNull = Orders | null;

export interface IOrdersRepository {
  findById(orderId: string): Promise<OrderOrNull>;
  findAll(userId: string): Promise<Orders[]>;
  createOrder(userId: string, total: number): Promise<Orders>;
  deleteOrder(orderId: string): Promise<Orders>;
  updateOrderStatus(
    userId: string,
    orderId: string,
    status: Status,
  ): Promise<OrderOrNull>;
}
