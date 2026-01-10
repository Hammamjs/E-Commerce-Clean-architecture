import { NotFoundError } from 'src/application/errors/not-found.error';
import { ItemStatus } from 'src/domain/enums/order-item-status.enum';

export class FindUserOrdersItemQuery {
  constructor(
    public readonly userId: string,
    public readonly status?: ItemStatus,
  ) {
    if (!userId) throw new NotFoundError();
  }
}
