import { OrderItem } from 'src/domain/entities/order-item.entity';
import { IUseCase } from '../base.use-case';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { UpdateOrderItemStatusCommand } from 'src/application/command/order-item/update-order-item-status.command';

export class UpdateOrderItemStatusUseCase implements IUseCase<
  UpdateOrderItemStatusCommand,
  OrderItem
> {
  constructor(private readonly orderItemRepository: IOrderItemsRepository) {}
  async execute(command: UpdateOrderItemStatusCommand): Promise<OrderItem> {
    const item = await this.orderItemRepository.findItemById(command.itemId);

    item.changeStatus(command.newStatus);

    return await this.orderItemRepository.save(item);
  }
}
