import { BaseRepository } from '../base.repository';
import { Inject } from '@nestjs/common';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { Pool } from 'pg';
import { Status } from '../../../domain/enums/order-status.enum';
import { OrderRow } from './order.row';

export class PgBaseOrdersRepository extends BaseRepository<OrderRow> {
  constructor(@Inject(PG_CONNECTION) conn: Pool) {
    super(conn, 'orders', ['total', 'status', 'userId']);
  }

  // data need to converted to snakeCase
  protected columnMap = {
    total: 'total',
    status: 'status',
    userId: 'user_id',
  };

  async findOrdersById(userId: string) {
    const order = await this.conn.query<OrderRow>(
      'SELECT id, total, status, created_at AS "createdAt" FROM orders WHERE user_id = $1',
      [userId],
    );
    return order.rows;
  }

  // Find single order for  user
  async findOrderByIdAndUserId(userId: string, orderId: string) {
    const order = await this.conn.query<OrderRow>(
      `
    SELECT * FROM orders WHERE id = $1 AND user_id = $2 RETURNING *
    `,
      [orderId, userId],
    );
    return order.rows[0];
  }

  async updateOneOrderStatus(userId: string, orderId: string, status: Status) {
    const updatedOrder = await this.conn.query<OrderRow>(
      `
    UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *
    `,
      [status, orderId, userId],
    );
    return updatedOrder.rows[0];
  }

  // async checkedOutOrders(orderId: string) {
  //   return this.conn.query<OrderRow>(`SELECT * FROM orders WHERE id = $1`, [
  //     orderId,
  //   ]);
  // }

  async createTx(userId: string, total: number) {
    const client = await this.conn.connect();
    try {
      await client.query('BEGIN');
      const createOrder = await client.query<OrderRow>(
        `
      INSERT INTO orders (user_id, total)
      SELECT user_id, $2
      FROM carts
      WHERE user_id = $1
      RETURNING *
    `,
        [userId, total],
      );
      await client.query('COMMIT');
      return createOrder.rows[0];
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error ', rollbackError);
      }
      throw err;
    } finally {
      client.release();
    }
  }

  // async cancelOrder(orderId: string)
}
