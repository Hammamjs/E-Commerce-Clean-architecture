import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { Pool, PoolClient } from 'pg';
import { PgBaseCartItemsRepository } from './pg.base-cart-items.repository';
import { CartItems } from 'src/domain/entities/cart-items.entity';
import { CartItemsRow } from './cart-items.row';

export class PgCartItemsReposiory
  extends PgBaseCartItemsRepository
  implements ICartItemsRepository
{
  constructor(public conn: Pool) {
    super(conn);
  }

  private toEntity(row: CartItemsRow) {
    return new CartItems(
      row.id,
      row.cartId,
      row.productId,
      row.unitPrice,
      row.quantity,
      row.total,
      row.createdAt,
    );
  }

  async findAllItemsForCart(cartId: string): Promise<CartItems[]> {
    const rows = await this.findCartItemsByCartId(cartId);
    console.log(rows);
    return rows.map((row) => this.toEntity(row));
  }

  async addItem(client: PoolClient, cart: CartItems): Promise<CartItems> {
    const row = await this.addItemTx(client, cart);
    return this.toEntity(row);
  }

  async removeItem(cart: CartItems): Promise<CartItems> {
    const row = await this.removeItemTx(cart);
    return this.toEntity(row);
  }
}
