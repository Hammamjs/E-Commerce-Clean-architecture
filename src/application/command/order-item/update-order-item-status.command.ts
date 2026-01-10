import { ItemStatus } from 'src/domain/enums/order-item-status.enum';

export class UpdateOrderItemStatusCommand {
  constructor(
    public readonly itemId: string,
    public readonly newStatus: ItemStatus,
  ) {}
}
