import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { Pool, PoolClient } from 'pg';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { OrderItemRow } from './order-item.row';
import { SQL } from './SQL';
import { asyncContext, AsyncContext } from '../async-context/async-context';

export class PgOrderItemRepository implements IOrderItemsRepository {
  constructor(
    readonly _conn: Pool,
    private _asyncContext: AsyncContext = asyncContext,
  ) {}

  // protected columnMap = {
  //   orderId: 'order_id',
  //   productId: 'product_id',
  //   unitPrice: 'unit_price',
  //   status: 'status',
  // };

  private _toEntity(row: OrderItemRow) {
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

  private getClient(): Pool | PoolClient {
    return this._asyncContext.getClient() ?? this._conn;
  }
  async findItemById(id: string): Promise<OrderItem> {
    const client = this.getClient();
    const { rows } = await client.query<OrderItemRow>(SQL.findById, [id]);
    return this._toEntity(rows[0]);
  }

  async findByOrdersId(orderIds: string[]): Promise<OrderItem[]> {
    const client = this.getClient();
    const { rows, rowCount } = await client.query<OrderItemRow>(
      SQL.findByOrdersId,
      [orderIds],
    );

    if (rowCount === 0) return [];

    return rows.map((row) => this._toEntity(row));
  }

  async update(item: OrderItem): Promise<OrderItem> {
    const client = this.getClient();

    const { rows } = await client.query<OrderItemRow>(SQL.update, [
      item.status,
      item.id,
    ]);

    return this._toEntity(rows[0]);
  }

  async createFromCart(orderId: string, cartId: string): Promise<OrderItem[]> {
    const client = this.getClient();
    const { rows } = await client.query<OrderItemRow>(SQL.createItemsFromCart, [
      orderId,
      cartId,
    ]);
    return rows.map((row) => this._toEntity(row));
  }
}
