import { BaseRepository } from '../base.repository';
import { Inject } from '@nestjs/common';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { Pool, PoolClient } from 'pg';
import { CartItemsRow } from './cart-items.row';
import { ProductDto } from 'src/interfaces/dto/productsDto/products.dto';
import { CartItems } from 'src/domain/entities/cart-items.entity';

export class PgBaseCartItemsRepository extends BaseRepository<CartItemsRow> {
  constructor(@Inject(PG_CONNECTION) readonly conn: Pool) {
    super(conn, 'cart_items', ['cartId', 'productId', 'quantity']);
  }

  protected columnMap = {
    cartId: 'cart_id',
    productId: 'product_id',
    quantity: 'quantity',
    unitPrice: 'unit_price',
  };

  async findCartItemsByCartId(cartId: string) {
    return this.conn
      .query<CartItemsRow>(
        `
        SELECT 
          id,
          cart_id AS "cartId",
          product_id AS "productId",
          total, quantity,
          unit_price AS "unitPrice",
          created_at AS "createdAt"
        FROM cart_items
          WHERE cart_id = $1`,
        [cartId],
      )
      .then((row) => row.rows);
  }

  async addItemTx(client: PoolClient, createCartItemDto: CartItems) {
    const cartItemQuery = `
    INSERT INTO cart_items (cart_id, product_id,quantity, unit_price, total)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET
     quantity = cart_items.quantity + EXCLUDED.quantity,
     unit_price = EXCLUDED.unit_price,
     total = EXCLUDED.unit_price * (cart_items.quantity + EXCLUDED.quantity)
     RETURNING id, cart_id AS "cartId", unit_price AS "unitPrice", total, created_at AS "createdAt", quantity, total
    `;
    const cartItem = await client.query<CartItemsRow>(cartItemQuery, [
      createCartItemDto.cartId,
      createCartItemDto.productId,
      createCartItemDto.getQuantity(),
      createCartItemDto.getUnitPrice(),
      createCartItemDto.getTotal(),
    ]);

    return cartItem.rows[0];
  }

  async removeItemTx(updateCartItemDto: CartItems) {
    // do isloation to prevent race condition or data corruption
    const client = await this.conn.connect();
    const query = `
  SELECT id, in_stock 
  FROM products
  WHERE id = $1
  FOR UPDATE
 `;
    try {
      await client.query('BEGIN');
      const productResult = await client.query(query, [
        updateCartItemDto.productId,
      ]);

      if (productResult.rowCount === 0) throw new Error('Product not exist');

      const cartItemQuery = `
        UPDATE cart_items
        SET 
         quantity = quantity - $3,
         total = unit_price * (quantity - $3)
        WHERE cart_id = $1
         AND product_id = $2
         AND quantity >= $3
         RETURNING id, cart_id AS "cartId",
         product_id AS "productId",
         quantity, total, 
         unit_price AS "unitPrice",
         created_at AS "createdAt"
        `;

      const cartItem = await client.query<CartItemsRow>(cartItemQuery, [
        updateCartItemDto.cartId,
        updateCartItemDto.productId,
        updateCartItemDto.getQuantity(),
      ]);

      await client.query('COMMIT');

      return cartItem.rows[0];
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error', rollbackError);
      }
      throw err;
    } finally {
      client.release();
    }
  }
}
