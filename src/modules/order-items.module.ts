import { Module } from '@nestjs/common';
import { CreateOrderFromCartUseCase } from 'src/application/use-cases/order-items/create-order-from-cart.use-case';
import { FindItemUseCase } from 'src/application/use-cases/order-items/find-item.use-case';
import { FindUserOrderItemsUseCase } from 'src/application/use-cases/order-items/find-user-orders.use-case';
import { OrderItemFacade } from 'src/application/use-cases/order-items/order-item.facade';
import { UpdateOrderItemStatusUseCase } from 'src/application/use-cases/order-items/update-order-item-status.use-case';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { PgOrderItemRepository } from 'src/infrastructure/persistence/order-items/pg.order-items.repository';
import { OrderItemsController } from 'src/interfaces/http/order-items.controller';
import { DatabaseModule } from './Database.module';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { PgOrdersRepository } from 'src/infrastructure/persistence/order/pg.orders.repository';

@Module({
  controllers: [OrderItemsController],
  providers: [
    {
      provide: OrderItemFacade,
      useFactory: (
        repo: IOrderItemsRepository,
        oderRepo: IOrdersRepository,
      ) => {
        const create = new CreateOrderFromCartUseCase(repo);
        const updateStatus = new UpdateOrderItemStatusUseCase(repo);
        const findUserItems = new FindUserOrderItemsUseCase(repo, oderRepo);
        const findItem = new FindItemUseCase(repo);

        return new OrderItemFacade(
          findItem,
          findUserItems,
          create,
          updateStatus,
        );
      },
      inject: ['IOrderItemsRepository', 'IOrdersRepository'],
    },
    {
      provide: 'IOrderItemsRepository',
      useClass: PgOrderItemRepository,
    },
    {
      provide: 'IOrdersRepository',
      useClass: PgOrdersRepository,
    },
  ],
  exports: [OrderItemFacade],
  imports: [DatabaseModule],
})
export class OrderItemsModule {}
