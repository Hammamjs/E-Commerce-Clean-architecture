import { CartItems } from 'src/domain/entities/cart-items.entity';
import { Cart } from 'src/domain/entities/cart.entity';

export class CartWithItems {
  constructor(
    public readonly cart: Cart,
    public readonly items: CartItems[],
  ) {
    this.cart = cart;
    this.items = items;
  }
}
