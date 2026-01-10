import { NotFoundError } from 'src/application/errors/not-found.error';
import { Status } from 'src/domain/enums/order-status.enum';

export class UpdateCartChekoutStatus {
  constructor(
    public readonly userId: string,
    public readonly status: Status,
  ) {
    if (!userId) throw new NotFoundError('User id not provided');
    this.userId = userId;
    this.status = status;
  }
}
