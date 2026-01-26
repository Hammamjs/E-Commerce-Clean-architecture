import { Cart } from '../entities/cart.entity';

type CartOrNull = Cart | null;
export interface ICartRepository {
  findById(id: string): Promise<CartOrNull>;
  update(cart: Cart): Promise<Cart>;
  create(userId: string): Promise<Cart>;
  delete(id: string): Promise<Cart>;
  findByUserId(userId: string): Promise<CartOrNull>;
}
