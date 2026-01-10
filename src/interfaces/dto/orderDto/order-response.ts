import { Status } from 'src/domain/enums/order-status.enum';

export class OrderResponse {
  constructor(
    public readonly id: string,
    public readonly total: number,
    public readonly status: Status,
  ) {
    this.id = id;
    this.total = total;
    this.status = status;
  }
}
