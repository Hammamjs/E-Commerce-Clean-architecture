import { CreateOrderItemCommand } from 'src/application/command/order-item/create-order-items.command';
import { IUseCase } from '../base.use-case';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';

export class CreateOrderFromCartUseCase implements IUseCase<
  CreateOrderItemCommand,
  OrderItem[]
> {
  constructor(private readonly _orderItem: IOrderItemsRepository) {}

  async execute(command: CreateOrderItemCommand): Promise<OrderItem[]> {
    return await this._orderItem.createFromCart(
      command.orderId,
      command.cartId,
    );
  }
}
