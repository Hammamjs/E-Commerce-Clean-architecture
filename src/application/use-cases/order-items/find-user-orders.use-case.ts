import { FindUserOrdersItemQuery } from 'src/application/queries/order-items/find-user-orders-items.query';
import { IUseCase } from '../base.use-case';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { NotFoundError } from 'src/application/errors/not-found.error';
import { Orders } from 'src/domain/entities/orders.entity';

type FinduserOrderItemsType = { orders: Orders[]; items: OrderItem[] };

export class FindUserOrderItemsUseCase implements IUseCase<
  FindUserOrdersItemQuery,
  FinduserOrderItemsType
> {
  constructor(
    private readonly _orderItemRepository: IOrderItemsRepository,
    private readonly _ordersRepository: IOrdersRepository,
  ) {}

  async execute(
    query: FindUserOrdersItemQuery,
  ): Promise<FinduserOrderItemsType> {
    const orders = await this._ordersRepository.findAll(query.userId);

    if (!orders.length) throw new NotFoundError('No orders exist');

    const orderIds = orders.map((order) => order.id);

    const orderItems = await this._orderItemRepository.findByOrdersId(orderIds);

    return {
      orders: orders,
      items: orderItems,
    };
  }
}
