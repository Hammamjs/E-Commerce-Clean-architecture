import { Orders } from '../entities/orders.entity';
import { Status } from '../enums/order-status.enum';

type OrderOrNull = Orders | null;

export interface IOrdersRepository {
  findById(orderId: string): Promise<OrderOrNull>;
  findAll(userId: string): Promise<Orders[]>;
  createOrder(userId: string, total: number): Promise<OrderOrNull>;
  deleteOrder(orderId: string): Promise<OrderOrNull>;
  updateOrderStatus(
    userId: string,
    orderId: string,
    status: Status,
  ): Promise<OrderOrNull>;
}
