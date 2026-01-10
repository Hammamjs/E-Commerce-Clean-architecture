import { CreateOrderUseCase } from './create-order.use-case';
import { DeleteOrderUseCase } from './delete-order.use-case';
import { FindUserOrderUseCase } from './find-user-order.use-case';
import { FindUserOrdersUseCase } from './find-user-orders.use-case';
import { UpdateOrderUseCase } from './update-order.use-case';

export class OrderFacade {
  constructor(
    public readonly create: CreateOrderUseCase,
    public readonly update: UpdateOrderUseCase,
    public readonly findOrders: FindUserOrdersUseCase,
    public readonly findOrder: FindUserOrderUseCase,
    public readonly deleteOrder: DeleteOrderUseCase,
  ) {}
}
