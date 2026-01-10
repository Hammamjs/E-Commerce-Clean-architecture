import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { PgBaseOrdersRepository } from './pg.base.orders.repository';
import { Pool } from 'pg';
import { Orders } from 'src/domain/entities/orders.entity';
import { OrderRow } from './order.row';
import { PgBaseOrderItemsRepository } from '../order-items/pg.base.order-items.repository';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'src/domain/enums/order-status.enum';

export class PgOrdersRepository
  extends PgBaseOrdersRepository
  implements IOrdersRepository
{
  constructor(
    readonly conn: Pool,
    private orderItemRepo: PgBaseOrderItemsRepository,
  ) {
    super(conn);
  }

  private toEntity(row: OrderRow) {
    return new Orders(
      row.id,
      row.userId,
      row.status,
      row.total,
      row.items || [],
    );
  }

  // Get all users orders
  async findAll(userId: string) {
    const rows = await this.findOrdersById(userId);
    return rows.map((row) => this.toEntity(row));
  }

  // Get unique order
  async findById(orderId: string): Promise<Orders> {
    const orderRow = await this.findOne(orderId);
    console.debug(orderRow);
    if (!orderRow) throw new NotFoundException('Order with this id not exist');

    const itemsRow = await this.orderItemRepo.getUserOrdersHistory([]);

    const items = itemsRow.map(
      (item) =>
        new OrderItem(
          item.id,
          item.orderId,
          item.productId,
          item.unitPrice,
          item.quantity,
          item.status,
          item.createdAt,
        ),
    );
    return this.toEntity({ ...orderRow, items });
  }

  async createOrder(userId: string, total: number): Promise<Orders> {
    const row = await this.createTx(userId, total);
    return this.toEntity(row);
  }

  async updateOrderStatus(
    userId: string,
    orderId: string,
    status: Status,
  ): Promise<Orders> {
    const row = await this.updateOneOrderStatus(userId, orderId, status);
    return this.toEntity(row);
  }

  async deleteOrder(orderId: string): Promise<Orders> {
    const row = await this.findOne(orderId);
    if (!row) throw new NotFoundException('Order not exist');
    return this.toEntity(row);
  }
}
