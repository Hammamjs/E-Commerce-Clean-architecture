import { Module } from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.use-case';
import { DeleteOrderUseCase } from 'src/application/use-cases/order/delete-order.use-case';
import { FindUserOrderUseCase } from 'src/application/use-cases/order/find-user-order.use-case';
import { FindUserOrdersUseCase } from 'src/application/use-cases/order/find-user-orders.use-case';
import { OrderFacade } from 'src/application/use-cases/order/order.facade';
import { UpdateOrderUseCase } from 'src/application/use-cases/order/update-order.use-case';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { PgOrdersRepository } from 'src/infrastructure/persistence/order/pg.orders.repository';
import { OrdersController } from 'src/interfaces/http/orders.controller';
import { DatabaseModule } from './Database.module';

@Module({
  controllers: [OrdersController],
  providers: [
    {
      provide: OrderFacade,
      useFactory: (repo: IOrdersRepository) =>
        new OrderFacade(
          new CreateOrderUseCase(repo),
          new UpdateOrderUseCase(repo),
          new FindUserOrdersUseCase(repo),
          new FindUserOrderUseCase(repo),
          new DeleteOrderUseCase(repo),
        ),
      inject: ['IOrdersRepository'],
    },
    {
      provide: 'IOrdersRepository',
      useClass: PgOrdersRepository,
    },
  ],
  exports: [OrderFacade],
  imports: [DatabaseModule],
})
export class OrdersModule {}
