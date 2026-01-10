import { BaseRepository } from '../base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { Pool } from 'pg';
import { ItemStatus } from '../../../interfaces/dto/Order-itemDto/order-items-status';
import { OrderItemRow } from './order-item.row';

@Injectable()
export class PgBaseOrderItemsRepository extends BaseRepository<OrderItemRow> {
  constructor(@Inject(PG_CONNECTION) readonly conn: Pool) {
    super(conn, 'order_items', [
      'order_id',
      'product_id',
      'unit_price',
      'status',
    ]);
  }
  protected columnMap = {
    orderId: 'order_id',
    productId: 'product_id',
    unitPrice: 'unit_price',
    status: 'status',
  };

  async getUserOrdersHistory(orderIds: string[]) {
    const query = `
      SELECT
        id, 
        order_id AS "orderId", 
        product_id AS "productId", 
        unit_price AS "unitPrice", 
        created_at AS "createdAt",
        status
      FROM order_items
        WHERE order_id = ANY($1)`;

    const res = await this.conn.query<OrderItemRow>(query, [orderIds]);

    console.log(res.rows);

    return res.rows;
  }

  async updateOrderItemStatus(orderItemId: string, status: ItemStatus) {
    const updatedOrder = await this.conn.query<OrderItemRow>(
      `UPDATE order_items SET status = $1 WHERE id = $2 RETURNING *`,
      [status, orderItemId],
    );

    return updatedOrder.rows[0];
  }

  async createTx(orderId: string, cartId: string) {
    const client = await this.conn.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query<OrderItemRow>(
        `
        INSERT INTO order_items (order_id, product_id, unit_price, quantity)
        SELECT $1, product_id, unit_price, quantity
        FROM cart_items
        WHERE cart_id = $2
        RETURNING id,
         product_id AS "productId",
         order_id AS "orderId",
         unit_price AS "unitPrice",
         quantity, status,
         created_at AS createAt
      `,
        [orderId, cartId],
      );
      await client.query('COMMIT');
      return res.rows;
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
}
