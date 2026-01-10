import { Orders } from 'src/domain/entities/orders.entity';
import { IUseCase } from '../base.use-case';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { FindUserOrdersQuery } from 'src/application/queries/order/find-user-orders.query';

export class FindUserOrdersUseCase implements IUseCase<
  FindUserOrdersQuery,
  Orders[]
> {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(query: FindUserOrdersQuery): Promise<Orders[]> {
    return this.orderRepository.findAll(query.userId);
  }
}
