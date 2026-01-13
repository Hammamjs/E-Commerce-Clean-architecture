import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { Cart } from 'src/domain/entities/cart.entity';
import { Pool } from 'pg';
import { CartRow } from './cart.row';
import { SQL } from './SQL';
import { NotFoundError } from 'src/application/errors/not-found.error';
import { InternalServerError } from 'src/application/errors/internal-server.error';
import { asyncContext, AsyncContext } from '../async-context/async-context';

export class PgCartRepository implements ICartRepository {
  constructor(
    private readonly _conn: Pool,
    private readonly _asyncContext: AsyncContext = asyncContext,
  ) {}

  private _getClient() {
    return this._asyncContext.getClient() ?? this._conn;
  }

  private toEntity(row: CartRow) {
    return new Cart(row.userId, row.id, row.status, row.createdAt);
  }

  protected columnMap = {
    userId: 'user_id',
    status: 'status',
  };

  // private toRow(cart: Cart) {
  //   return {
  //     userId: cart.userId,
  //     status: cart.getStatus(),
  //   };
  // }

  async findById(id: string): Promise<Cart | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<CartRow>(SQL.findByIdQuery, [
      id,
    ]);
    if (rowCount === 0) return null;
    return this.toEntity(rows[0]);
  }

  async update(cart: Cart): Promise<Cart> {
    const { rows, rowCount } = await this._conn.query<CartRow>(SQL.updateCart, [
      cart.status,
      cart.id,
    ]);

    if (rowCount === 0) throw new NotFoundError('Cart not found');
    return this.toEntity(rows[0]);
  }

  public create = async (userId: string) => {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<CartRow>(SQL.create, [
      userId,
    ]);

    if (rowCount === 0) throw new InternalServerError();

    return this.toEntity(rows[0]);
  };

  async deleteById(id: string): Promise<Cart | null> {
    const client = this._getClient();

    const { rows, rowCount } = await client.query<CartRow>(SQL.deleteQuery, [
      id,
    ]);

    if (rowCount === 0) return null;

    return this.toEntity(rows[0]);
  }

  async findByUserId(userId: string): Promise<Cart> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<CartRow>(SQL.findUserCart, [
      userId,
    ]);

    if (rowCount === 0) throw new NotFoundError('User cart not exist');

    return this.toEntity(rows[0]);
  }

  async delete(id: string): Promise<Cart | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<CartRow>(
      `DELETE FROM carts WHERE id = $1 RETURNING *`,
      [id],
    );

    if (rowCount === 0)
      throw new NotFoundError('Cart not exist or maybe removed');

    return this.toEntity(rows[0]);
  }
}
