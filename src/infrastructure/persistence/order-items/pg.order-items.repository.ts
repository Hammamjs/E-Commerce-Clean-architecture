import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { PgBaseOrderItemsRepository } from './pg.base.order-items.repository';
import { Pool } from 'pg';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { OrderItemRow } from './order-item.row';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class PgOrderItemRepository
  extends PgBaseOrderItemsRepository
  implements IOrderItemsRepository
{
  constructor(readonly conn: Pool) {
    super(conn);
  }

  private toEntity(row: OrderItemRow) {
    return new OrderItem(
      row.id,
      row.orderId,
      row.productId,
      row.unitPrice,
      row.quantity,
      row.status,
      row.createdAt,
    );
  }

  async findItemById(itemId: string): Promise<OrderItem> {
    const row = await this.findOne(itemId);
    if (!row) throw new NotFoundError('No item exists');
    return this.toEntity(row);
  }

  async findByOrdersId(orderIds: string[]): Promise<OrderItem[]> {
    const rows = await this.getUserOrdersHistory(orderIds);
    return rows.map((row) => this.toEntity(row));
  }

  async save(item: OrderItem): Promise<OrderItem> {
    const row = await this.update(item.id, { status: item.status });

    return this.toEntity(row);
  }

  async createFromCart(orderId: string, cartId: string): Promise<OrderItem[]> {
    if (!orderId) throw new NotFoundError('Order id not provided');
    const rows = await this.createTx(orderId, cartId);
    if (!rows) throw new NotFoundError('Create orderItem From cart failed');
    return rows.map((row) => this.toEntity(row));
  }
}
