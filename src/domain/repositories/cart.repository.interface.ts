import { PoolClient } from 'pg';
import { Cart } from '../entities/cart.entity';

type CartOrNull = Cart | null;

export interface ICartRepository {
  findAll(): Promise<Cart[]>;
  findById(id: string): Promise<CartOrNull>;
  updateCart(cart: Cart): Promise<Cart>;
  createCart(client: PoolClient, userId: string): Promise<Cart>;
  deleteById(id: string): Promise<Cart>;
  findByUserId(userId: string): Promise<CartOrNull>;
}
