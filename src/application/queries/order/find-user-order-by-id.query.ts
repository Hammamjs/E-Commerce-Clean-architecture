import { NotFoundError } from '../../errors/not-found.error';

export class FindUserOrderByIdQuery {
  constructor(public readonly orderId: string) {
    if (!orderId) throw new NotFoundError('Order id is required');
  }
}
