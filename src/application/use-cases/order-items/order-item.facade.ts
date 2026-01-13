import { FindItemUseCase } from './find-item.use-case';
import { FindUserOrderItemsUseCase } from './find-user-orders.use-case';
import { UpdateOrderItemStatusUseCase } from './update-order-item-status.use-case';

export class OrderItemFacade {
  constructor(
    public readonly findItem: FindItemUseCase,
    public readonly findOrderItems: FindUserOrderItemsUseCase,
    public readonly updateStatus: UpdateOrderItemStatusUseCase,
  ) {}
}
