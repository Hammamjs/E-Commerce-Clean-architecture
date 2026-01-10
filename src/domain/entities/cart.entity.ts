import { Status } from 'src/domain/enums/order-status.enum';

export class Cart {
  status: Status;
  constructor(
    public readonly userId: string,
    public readonly id: string,
    status?: Status,
    public createdAt?: string,
  ) {
    this.status = status ?? Status.ACTIVE;
  }

  getStatus() {
    return this.status;
  }

  checkout() {
    if (this.status !== Status.ACTIVE)
      throw new Error('Only active carts can be checked out');
    this.status = Status.CHECKEDOUT;
  }
}
