import { CartItems } from '../entities/cart-items.entity';

export interface ICartItemsRepository {
  findAllItemsForCart(cartId: string): Promise<CartItems[]>;
  addItem(cart: CartItems): Promise<CartItems>;
  removeItem(cart: CartItems): Promise<CartItems>;
}
