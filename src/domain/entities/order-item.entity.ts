import { InvalidTransitionStatusError } from 'src/application/errors/Invalid-status-transition.error';
import { ItemStatus } from 'src/interfaces/dto/Order-itemDto/order-items-status';

export class OrderItem {
  // allowed transition
  private allowedTransitions: Record<ItemStatus, ItemStatus[]> = {
    PENDING: [ItemStatus.CANCELED, ItemStatus.CONFIRMED],
    CONFIRMED: [ItemStatus.SHIPPED, ItemStatus.CANCELED],
    SHIPPED: [ItemStatus.ARRIVED, ItemStatus.CANCELED],
    ARRIVED: [],
    CANCELED: [],
  };

  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly productId: string,
    public readonly unitPrice: number,
    public readonly quantity: number,
    public status: ItemStatus,
    public readonly createdAt: Date,
  ) {}

  changeStatus(newStatus: ItemStatus) {
    const allowed = this.allowedTransitions[this.status];
    if (!allowed.includes(newStatus)) {
      throw new InvalidTransitionStatusError(this.status, newStatus);
    }
    this.status = newStatus;
  }
}
