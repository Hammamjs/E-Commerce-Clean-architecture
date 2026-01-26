import { Orders } from 'src/domain/entities/orders.entity';
import { IUseCase } from '../base.use-case';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { FindUserOrderByIdQuery } from 'src/application/queries/order/find-user-order-by-id.query';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class FindUserOrderUseCase implements IUseCase<
  FindUserOrderByIdQuery,
  Orders
> {
  constructor(private readonly _orderRepository: IOrdersRepository) {}
  async execute(query: FindUserOrderByIdQuery): Promise<Orders> {
    const order = await this._orderRepository.findById(query.orderId);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }
}
