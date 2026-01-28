import { Orders } from 'src/domain/entities/orders.entity';
import { IUseCase } from '../base.use-case';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { FindUserOrderByIdQuery } from 'src/application/queries/order/find-user-order-by-id.query';

export class FindUserOrderUseCase implements IUseCase<
  FindUserOrderByIdQuery,
  Orders | null
> {
  constructor(private readonly _orderRepository: IOrdersRepository) {}
  async execute(query: FindUserOrderByIdQuery): Promise<Orders | null> {
    const order = await this._orderRepository.findById(query.orderId);
    return order;
  }
}
