import { BadRequestException, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { BaseRepository } from '../base.repository';
import { ProductRow } from './product.row';

export class PgBaseProductsRepository extends BaseRepository<ProductRow> {
  protected columnMap = {
    name: 'name',
    price: 'price',
    inStock: 'in_stock',
  };
  constructor(@Inject(PG_CONNECTION) conn: Pool) {
    super(conn, 'products', ['name', 'price', 'inStock']);
  }

  update = async (id: string, data: Partial<ProductRow>) => {
    const entries = Object.entries(data).filter(
      ([k, v]) => !!v && this.allowedColumns.includes(k),
    );

    const fields = entries
      .map(([k], i) => `${this.columnMap[k]} = $${i + 1}`)
      .join(', ');
    const values = entries.map(([, v]) => v);

    console.log(values);
    console.log(fields);
    return this.conn
      .query<ProductRow>(
        `
     UPDATE products SET ${fields} WHERE id = $${values.length + 1} RETURNING id, name, price, in_stock AS "inStock", created_at AS "createdAt"
     `,
        [...values, id],
      )
      .then((res) => res.rows[0]);
  };

  protected create = async (data: Partial<ProductRow>) => {
    const entries = Object.entries(data).filter(
      ([k, v]) => !!v && this.allowedColumns.includes(k),
    );

    const fields = entries.map(([k]) => `${this.columnMap[k]}`).join(', ');
    const fieldsCount = entries.map((_, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v);

    return this.conn
      .query<ProductRow>(
        `
     INSERT INTO products (${fields}) VALUES (${fieldsCount}) RETURNING id, name, price, in_stock AS "inStock", created_at "createdAt"
     `,
        values,
      )
      .then((res) => res.rows[0]);
  };

  protected findOne = async (id: string) => {
    return this.conn
      .query<ProductRow>(
        `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        WHERE id = $1
        `,
        [id],
      )
      .then((res) => res.rows[0]);
  };

  getAllRows = async () => {
    return this.conn
      .query<ProductRow>(
        `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        `,
      )
      .then((res) => res.rows);
  };

  // For Transaction (tx)
  async decreaseStockTx(productId: string, quantity: number) {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    const client = await this.conn.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query<{ in_stock: number }>(
        `UPDATE products
    SET in_stock = in_stock - $2
    WHERE id = $1 AND in_stock >= $2
    RETURNING in_stock
    `,
        [productId, quantity],
      );

      if (res.rowCount === 0)
        throw new BadRequestException(
          'Product not found or insufficient stock',
        );
      await client.query('COMMIT');
      return res.rows[0].in_stock;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback Error ', rollbackErr);
      }
      throw err;
    } finally {
      client.release();
    }
  }

  async increaseStockTx(productId: string, quantity: number) {
    if (quantity <= 0)
      throw new Error('Product quantity must be non-negative positive');
    const client = await this.conn.connect();
    const query =
      'UPDATE products SET in_stock = in_stock + $2 WHERE id = $1 RETURNING in_stock';
    try {
      await client.query('BEGIN');
      const product = await client.query<{ in_stock: number }>(query, [
        productId,
        quantity,
      ]);
      if (product.rowCount === 0) throw new Error('Update stock failed');
      await client.query('COMMIT');
      return product.rows[0];
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback error ', rollbackErr);
      }
      throw err;
    } finally {
      client.release();
    }
  }
}
