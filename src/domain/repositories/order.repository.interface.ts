import { Orders } from '../entities/orders.entity';
import { Status } from '../enums/order-status.enum';

export interface IOrdersRepository {
  findById(orderId: string): Promise<Orders>;
  findAll(userId: string): Promise<Orders[]>;
  createOrder(userId: string, total: number): Promise<Orders>;
  deleteOrder(orderId: string): Promise<Orders>;
  updateOrderStatus(
    userId: string,
    orderId: string,
    status: Status,
  ): Promise<Orders>;
}
