import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { CartRow } from './cart.row';
import { Cart } from 'src/domain/entities/cart.entity';
import { PgBaseCartRepository } from './pg.base.cart.repository';
import { Pool, PoolClient } from 'pg';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class PgCartRepository
  extends PgBaseCartRepository
  implements ICartRepository
{
  constructor(conn: Pool) {
    super(conn);
  }

  protected columnMap = {
    userId: 'user_id',
    status: 'status',
  };

  private toRow(cart: Cart) {
    return {
      userId: cart.userId,
      status: cart.getStatus(),
    };
  }

  // private toEntity(row: CartRow) {
  //   return new Cart(row.userId, row.id, row.status, row.createdAt);
  // }

  async findAll(): Promise<Cart[]> {
    const rows = await super.getAllRows();
    return rows;
  }

  async findById(id: string): Promise<Cart | null> {
    const exists = await this.findOne(id);
    return exists ?? null;
  }

  async updateCart(cart: Cart): Promise<Cart> {
    if (!cart.id) throw new NotFoundError();
    const row = await this.update(cart.id, { status: cart.status });
    return row;
  }

  public createCart = async (client: PoolClient, userId: string) => {
    const row = await this.createUserCart(client, { userId });
    return row;
  };

  async deleteById(id: string): Promise<Cart> {
    const row = await this.deleteTx(id);
    return row;
  }

  async findByUserId(userId: string): Promise<Cart> {
    const row = await this.getUserCart(userId);
    return row;
  }
}
