import { IUseCase } from 'src/application/use-cases/base.use-case';
import { UpdateOrderCommand } from 'src/application/command/order/update-order.command';
import { Orders } from 'src/domain/entities/orders.entity';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';

export class UpdateOrderUseCase implements IUseCase<
  UpdateOrderCommand,
  Orders
> {
  constructor(private orderRepository: IOrdersRepository) {}
  async execute(command: UpdateOrderCommand): Promise<Orders> {
    const { orderId, userId, status } = command;
    return await this.orderRepository.updateOrderStatus(
      userId,
      orderId,
      status,
    );
  }
}
