import { DeleteOrderCommand } from 'src/application/command/order/delete-order.command';
import { IUseCase } from '../base.use-case';
import { Orders } from 'src/domain/entities/orders.entity';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { ForbiddenError } from 'src/application/errors/forbidden.error';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class DeleteOrderUseCase implements IUseCase<
  DeleteOrderCommand,
  Orders | null
> {
  constructor(private readonly orderRepository: IOrdersRepository) {}

  async execute(command: DeleteOrderCommand): Promise<Orders | null> {
    const { orderId } = command;
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== orderId) throw new ForbiddenError();
    return this.orderRepository.deleteOrder(orderId);
  }
}
