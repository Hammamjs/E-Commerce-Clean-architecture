import { NonPositiveError } from 'src/application/errors/non-positive.error';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class AddCartItemCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice?: number,
    public cartId?: string,
  ) {
    if (!productId) throw new NotFoundError('Product id not prodvided');
    if (quantity <= 0) throw new NonPositiveError();
    if (unitPrice && unitPrice <= 0) throw new NonPositiveError();
  }

  setCartId(cartId: string) {
    this.cartId = cartId;
  }
}
