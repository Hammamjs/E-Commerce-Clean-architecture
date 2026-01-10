import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { IUseCase } from '../base.use-case';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { NotFoundError } from 'src/application/errors/not-found.error';
import { CartWithItems } from 'src/application/queries/cart/cart-with-items.query';

export class UserCartWithItemsUseCase implements IUseCase<
  string,
  CartWithItems
> {
  constructor(
    private readonly _cartRepo: ICartRepository,
    private readonly _cartItemRepo: ICartItemsRepository,
  ) {}

  async execute(userId: string): Promise<CartWithItems> {
    const cart = await this._cartRepo.findByUserId(userId);
    // Check if cart and id exist
    if (!cart || !cart.id) throw new NotFoundError('No cart for this user');
    // Get cart items
    const cartItems = await this._cartItemRepo.findAllItemsForCart(cart.id);

    return {
      cart,
      items: cartItems,
    };
  }
}
