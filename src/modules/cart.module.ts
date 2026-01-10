import { CartController } from 'src/interfaces/http/cart.controller';
import { PgCartRepository } from 'src/infrastructure/persistence/cart/pg.cart.repository';
import { Module } from '@nestjs/common';
import { CartFacade } from 'src/application/use-cases/cart/cart.facade';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
// import { CreateCartUseCase } from 'src/application/use-cases/cart/create-cart.use-case';
import { FindCartUseCase } from 'src/application/use-cases/cart/find-cart.use-case';
import { FindCartsUseCase } from 'src/application/use-cases/cart/find-carts.use-case';
import { DeleteCartUseCase } from 'src/application/use-cases/cart/delete-cart.use-case';
import { CheckoutCartUseCase } from 'src/application/use-cases/cart/checkout-cart.use-case';
import { DatabaseModule } from './Database.module';
import { PgCartItemsReposiory } from 'src/infrastructure/persistence/cart-items/pg-cart-items.repository';
import { CartItemsModule } from './cart-items.module';
import { UserCartWithItemsUseCase } from 'src/application/use-cases/cart/user-cart-with-items.use-case';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';

@Module({
  controllers: [CartController],
  providers: [
    {
      provide: CartFacade,
      useFactory: (
        repo: ICartRepository,
        cartItemRepo: ICartItemsRepository,
      ) => {
        // const create = new CreateCartUseCase(repo);
        const findCarts = new FindCartsUseCase(repo);
        const findById = new FindCartUseCase(repo);
        const deleteCart = new DeleteCartUseCase(repo);
        const cartCheckout = new CheckoutCartUseCase(repo);
        const userCartWithItems = new UserCartWithItemsUseCase(
          repo,
          cartItemRepo,
        );
        return new CartFacade(
          findCarts,
          userCartWithItems,
          // create,
          cartCheckout,
          findById,
          deleteCart,
        );
      },
      inject: ['ICartRepository', 'ICartItemsRepository'],
    },
    {
      provide: 'ICartRepository',
      useClass: PgCartRepository,
    },
    {
      provide: 'ICartItemsRepository',
      useClass: PgCartItemsReposiory,
    },
  ],
  exports: [CartFacade],
  imports: [DatabaseModule, CartItemsModule],
})
export class CartModule {}
