import { Module } from '@nestjs/common';
import {
 CART_ITEMS_REPO,
 CART_REPO,
 ORDER_ITEMS_REPO,
 ORDER_REPO,
 PRODUCT_REPO,
 UNIT_OF_WORK,
 USERS_REPO,
} from 'src/interfaces/di/tokens.di';
import { CheckOutController } from 'src/interfaces/http/check-out.controller';
import { DatabaseModule } from './Database.module';
import { PgCartItemsReposiory } from 'src/infrastructure/persistence/cart-items/pg.cart-items.repository';
import { PgProductsRepository } from 'src/infrastructure/persistence/products/pg.products.repository';
import { PgUserRepository } from 'src/infrastructure/persistence/users/pg.user.repository';
import { PgOrdersRepository } from 'src/infrastructure/persistence/order/pg.orders.repository';
import { PgOrderItemRepository } from 'src/infrastructure/persistence/order-items/pg.order-items.repository';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { CheckOutUseCase } from 'src/application/use-cases/check-out/check-out.use-case';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { PgUnitOfWork } from 'src/infrastructure/persistence/unit-of-work/pg.unit-of-work';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { PgCartRepository } from 'src/infrastructure/persistence/cart/pg.cart.repository';
import { AsyncContext } from 'src/infrastructure/persistence/async-context/async-context';
import { HelperQuery } from 'src/infrastructure/persistence/shared/helper-query';

@Module({
 imports: [DatabaseModule],
 controllers: [CheckOutController],
 providers: [
  {
   provide: CART_REPO,
   useFactory: (pool: Pool) => new PgCartRepository(pool),
   inject: [PG_CONNECTION],
  },
  {
   provide: UNIT_OF_WORK,
   useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
    new PgUnitOfWork(pool, asyncCtx),
   inject: [PG_CONNECTION],
  },
  {
   provide: CART_ITEMS_REPO,
   useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
    new PgCartItemsReposiory(pool, asyncCtx),
   inject: [PG_CONNECTION],
  },
  {
   provide: PRODUCT_REPO,
   useFactory: (pool: Pool, asyncCtx: AsyncContext, helperQuery: HelperQuery) =>
    new PgProductsRepository(pool, asyncCtx, helperQuery),
   inject: [PG_CONNECTION],
  },
  {
   provide: USERS_REPO,
   useFactory: (pool: Pool, helperQuery: HelperQuery) => new PgUserRepository(pool, helperQuery),
   inject: [PG_CONNECTION],
  },
  {
   provide: ORDER_REPO,
   useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
    new PgOrdersRepository(pool, asyncCtx),
   inject: [PG_CONNECTION],
  },
  {
   provide: ORDER_ITEMS_REPO,
   useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
    new PgOrderItemRepository(pool, asyncCtx),
   inject: [PG_CONNECTION],
  },
  {
   provide: CheckOutUseCase,
   useFactory: (
    cartRep: ICartRepository,
    cartItemsRepo: ICartItemsRepository,
    userRepo: IUserRepository,
    orderRepo: IOrdersRepository,
    orderItemRepo: IOrderItemsRepository,
    productRepo: IProductRepository,
    uow: IUnitOfWork,
   ) =>
    new CheckOutUseCase(
     cartRep,
     cartItemsRepo,
     userRepo,
     orderRepo,
     orderItemRepo,
     productRepo,
     uow,
    ),
   inject: [
    CART_REPO,
    CART_ITEMS_REPO,
    USERS_REPO,
    ORDER_REPO,
    ORDER_ITEMS_REPO,
    PRODUCT_REPO,
   ],
  },
 ],
 exports: [CheckOutUseCase],
})
export class CheckOutModule { }
