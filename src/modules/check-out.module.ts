import { Module } from '@nestjs/common';
import {
  CART_ITEMS_REPO,
  CART_REPO,
  ORDER_ITEMS_REPO,
  ORDER_REPO,
  PRODUCT_REPO,
  USERS_REPO,
} from 'src/domain/repositories/tokens.repositories';
import { CheckOutController } from 'src/interfaces/http/check-out.controller';
import { DatabaseModule } from './Database.module';
import { PgCartRepository } from 'src/infrastructure/persistence/cart/pg.cart.repository';
import { PgCartItemsReposiory } from 'src/infrastructure/persistence/cart-items/pg-cart-items.repository';
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

@Module({
  imports: [DatabaseModule],
  controllers: [CheckOutController],
  providers: [
    { provide: CART_REPO, useClass: PgCartRepository },
    { provide: CART_ITEMS_REPO, useClass: PgCartItemsReposiory },
    { provide: PRODUCT_REPO, useClass: PgProductsRepository },
    { provide: USERS_REPO, useClass: PgUserRepository },
    { provide: ORDER_REPO, useClass: PgOrdersRepository },
    { provide: ORDER_ITEMS_REPO, useClass: PgOrderItemRepository },
    {
      provide: CheckOutUseCase,
      useFactory: (
        cartRep: ICartRepository,
        cartItemsRepo: ICartItemsRepository,
        userRepo: IUserRepository,
        orderRepo: IOrdersRepository,
        orderItemRepo: IOrderItemsRepository,
        productRepo: IProductRepository,
      ) =>
        new CheckOutUseCase(
          cartRep,
          cartItemsRepo,
          userRepo,
          orderRepo,
          orderItemRepo,
          productRepo,
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
export class CheckOutModule {}
