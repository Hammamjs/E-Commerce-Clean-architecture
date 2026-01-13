import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { Pool } from 'pg';
import { CartItems } from 'src/domain/entities/cart-items.entity';
import { CartItemsRow } from './cart-items.row';
import { SQL } from './SQL';
import { asyncContext, AsyncContext } from '../async-context/async-context';

export class PgCartItemsReposiory implements ICartItemsRepository {
  constructor(
    private readonly _conn: Pool,
    private readonly _asyncContext: AsyncContext = asyncContext,
  ) {}

  private _getClient() {
    return this._asyncContext.getClient() ?? this._conn;
  }

  private _toEntity(row: CartItemsRow) {
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
    const client = this._getClient();
    const { rows, rowCount } = await client.query<CartItemsRow>(
      SQL.findAllItemsInCartQuery,
      [cartId],
    );

    if (rowCount === 0) return [];

    return rows.map((row) => this._toEntity(row));
  }

  async addItem(cart: CartItems): Promise<CartItems> {
    const client = this._getClient();
    const { rows } = await client.query<CartItemsRow>(SQL.insertItemQuery, [
      cart.cartId,
      cart.productId,
      cart.getQuantity(),
      cart.getUnitPrice(),
      cart.getTotal(),
    ]);

    return this._toEntity(rows[0]);
  }

  async removeItem(cart: CartItems): Promise<CartItems> {
    // do isloation to prevent race condition or data corruption
    const client = this._getClient();
    const { rows } = await client.query<CartItemsRow>(SQL.removeItemQuery, [
      cart.cartId,
      cart.productId,
      cart.getQuantity(),
    ]);

    return this._toEntity(rows[0]);
  }
}
