import { NonPositiveError } from 'src/application/errors/non-positive.error';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class RemoveCartItemCommand {
  constructor(
    readonly userId: string,
    readonly productId: string,
    readonly quantity: number,
    readonly cartId?: string,
  ) {
    if (!productId) throw new NotFoundError();
    if (quantity <= 0) throw new NonPositiveError();
  }
}
