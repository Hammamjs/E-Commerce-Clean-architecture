import { FindItemQuery } from 'src/application/queries/order-items/find-item.query';
import { IUseCase } from '../base.use-case';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';

export class FindItemUseCase implements IUseCase<FindItemQuery, OrderItem> {
  constructor(private readonly _orderItem: IOrderItemsRepository) {}

  async execute(item: FindItemQuery): Promise<OrderItem> {
    return await this._orderItem.findItemById(item.id);
  }
}
