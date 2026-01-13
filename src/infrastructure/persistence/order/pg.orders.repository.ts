import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { Pool } from 'pg';
import { Orders } from 'src/domain/entities/orders.entity';
import { Status } from 'src/domain/enums/order-status.enum';
import { OrderRow } from './order.row';
import { SQL } from './SQL';
import { asyncContext, AsyncContext } from '../async-context/async-context';

export class PgOrdersRepository implements IOrdersRepository {
  constructor(
    readonly _conn: Pool,
    private _asyncContext: AsyncContext = asyncContext,
  ) {}

  private _getClient() {
    return this._asyncContext.getClient() ?? this._conn;
  }

  // data need to converted to snakeCase
  private columnMap = {
    total: 'total',
    status: 'status',
    userId: 'user_id',
  };

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
  async findAll(userId: string): Promise<Orders[]> {
    const client = this._getClient();
    const { rows: orders, rowCount } = await client.query<OrderRow>(
      SQL.findAllOrdersPerUserQuery,
      [userId],
    );

    if (rowCount === 0) return [];

    return orders.map((order) => this.toEntity(order));
  }

  async findById(id: string): Promise<Orders | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<OrderRow>(SQL.findByIdQuery, [
      id,
    ]);
    if (rowCount === 0) return null;
    return this.toEntity(rows[0]);
  }

  async createOrder(userId: string, total: number): Promise<Orders | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<OrderRow>(SQL.createQuery, [
      userId,
      total,
    ]);

    if (rowCount === 0) return null;

    return this.toEntity(rows[0]);
  }

  async updateOrderStatus(
    userId: string,
    orderId: string,
    status: Status,
  ): Promise<Orders | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<OrderRow>(
      SQL.updateStatusQuery,
      [status, orderId, userId],
    );

    if (rowCount === 0) return null;

    return this.toEntity(rows[0]);
  }

  async deleteOrder(id: string): Promise<Orders | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<OrderRow>(SQL.deleteQuery, [
      id,
    ]);

    if (rowCount === 0) return null;

    return this.toEntity(rows[0]);
  }
}
