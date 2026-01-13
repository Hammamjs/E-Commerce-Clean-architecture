import { Cart } from '../entities/cart.entity';

type CartOrNull = Cart | null;
export interface ICartRepository {
  findById(id: string): Promise<CartOrNull>;
  update(cart: Cart): Promise<CartOrNull>;
  create(userId: string): Promise<CartOrNull>;
  delete(id: string): Promise<CartOrNull>;
  findByUserId(userId: string): Promise<CartOrNull>;
}
