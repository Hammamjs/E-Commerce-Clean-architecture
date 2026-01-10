import { IUseCase } from 'src/application/use-cases/base.use-case';
import { CreateOrderCommand } from 'src/application/command/order/create-order.command';
import { Orders } from 'src/domain/entities/orders.entity';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';

export class CreateOrderUseCase implements IUseCase<
  CreateOrderCommand,
  Orders
> {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(command: CreateOrderCommand): Promise<Orders> {
    const { total, userId } = command;
    const order = await this.orderRepository.createOrder(userId, total);
    return order;
  }
}
