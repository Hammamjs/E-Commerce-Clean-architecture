import { CartController } from 'src/interfaces/http/cart.controller';
import { PgCartRepository } from 'src/infrastructure/persistence/cart/pg.cart.repository';
import { forwardRef, Module } from '@nestjs/common';
import { CartFacade } from 'src/application/use-cases/cart/cart.facade';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { FindCartUseCase } from 'src/application/use-cases/cart/find-cart.use-case';
import { CheckoutCartUseCase } from 'src/application/use-cases/cart/checkout-cart.use-case';
import { DatabaseModule } from './Database.module';
import { CartItemsModule } from './cart-items.module';
import { UserCartWithItemsUseCase } from 'src/application/use-cases/cart/user-cart-with-items.use-case';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { Pool } from 'pg';
import { AsyncContext } from 'src/infrastructure/persistence/async-context/async-context';

@Module({
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartRepository',
      useFactory: (pool: Pool, asyncContext: AsyncContext) =>
        new PgCartRepository(pool, asyncContext),
      inject: [PG_CONNECTION],
    },
    {
      provide: CartFacade,
      useFactory: (
        repo: ICartRepository,
        cartItemRepo: ICartItemsRepository,
      ) => {
        const findById = new FindCartUseCase(repo);
        const cartCheckout = new CheckoutCartUseCase(repo);
        const userCartWithItems = new UserCartWithItemsUseCase(
          repo,
          cartItemRepo,
        );
        return new CartFacade(userCartWithItems, cartCheckout, findById);
      },
      inject: ['ICartRepository', 'ICartItemsRepository'],
    },
  ],
  exports: ['ICartRepository', CartFacade],
  imports: [DatabaseModule, forwardRef(() => CartItemsModule)],
})
export class CartModule {}
