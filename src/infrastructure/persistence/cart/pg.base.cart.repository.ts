import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { BaseRepository } from 'src/infrastructure/persistence/base.repository';
import { Cart } from 'src/domain/entities/cart.entity';

export class PgBaseCartRepository extends BaseRepository<Cart> {
  constructor(@Inject(PG_CONNECTION) conn: Pool) {
    super(conn, 'carts', ['userId', 'status']);
  }

  protected readonly columnMap = {
    userId: 'user_id',
  };
  async findCartByUserId(userId: string) {
    const res = await this.conn.query<Cart>(
      ' SELECT id, user_id AS "userId", status, created_at AS "createdAt" FROM carts WHERE "user_id" = $1',
      [userId],
    );
    return res.rows[0] ?? null;
  }

  public createUserCart = async (client: PoolClient, data: Partial<Cart>) => {
    return client
      .query<Cart>(
        `
    WITH inserted AS
     (
      INSERT INTO carts (user_id) VALUES ($1)
      ON CONFLICT DO NOTHING
      RETURNING *
     )
    SELECT * 
    FROM inserted
    UNION ALL
    SELECT * FROM 
    carts 
    WHERE user_id = $1 
    `,
        [data.userId],
      )
      .then((res) => res.rows[0]);
  };

  async getUserCart(user_id: string) {
    const query =
      'SELECT c.id, c.user_id AS "userId", c.status, c.created_at AS "createdAt" FROM carts c WHERE user_id = $1';
    return this.conn.query<Cart>(query, [user_id]).then((res) => res.rows[0]);
  }

  async deleteTx(cartId: string) {
    const client = await this.conn.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query<Cart>(
        `DELETE FROM carts WHERE id = $1 RETURNING *`,
        [cartId],
      );
      await client.query('COMMIT');
      return rows[0];
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback error ', rollbackErr);
      }
      throw err;
    }
  }
}
