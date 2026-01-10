import { Module } from '@nestjs/common';
import { AddCartItemUseCase } from 'src/application/use-cases/cart-items/add-items.use-case';
import { CartItemsFacade } from 'src/application/use-cases/cart-items/cart-item.facade';
import { FindAllCartItemsUseCase } from 'src/application/use-cases/cart-items/find-all-cart-items.use-case';
import { RemoveCartItemUseCase } from 'src/application/use-cases/cart-items/remove-item.use-case';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { PgCartItemsReposiory } from 'src/infrastructure/persistence/cart-items/pg-cart-items.repository';
import { CartItemsController } from 'src/interfaces/http/cart-items.controller';
import { DatabaseModule } from './Database.module';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { PgCartRepository } from 'src/infrastructure/persistence/cart/pg.cart.repository';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { PgUnitOfWork } from 'src/infrastructure/persistence/unit-of-work/pg.unit-of-work';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { PgProductsRepository } from 'src/infrastructure/persistence/products/pg.products.repository';

@Module({
  controllers: [CartItemsController],
  providers: [
    {
      provide: CartItemsFacade,
      useFactory: (
        repo: ICartItemsRepository,
        cartRepo: ICartRepository,
        uowRepo: IUnitOfWork,
        productRepo: IProductRepository,
      ) =>
        new CartItemsFacade(
          new RemoveCartItemUseCase(repo, cartRepo),
          new AddCartItemUseCase(repo, cartRepo, uowRepo, productRepo),
          new FindAllCartItemsUseCase(repo),
        ),
      inject: [
        'ICartItemsRepository',
        'ICartRepository',
        'IUnitOfWork',
        'IProductRepository',
      ],
    },
    {
      provide: 'ICartItemsRepository',
      useClass: PgCartItemsReposiory,
    },
    {
      provide: 'ICartRepository',
      useClass: PgCartRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: PgProductsRepository,
    },
    {
      provide: 'IUnitOfWork',
      useClass: PgUnitOfWork,
    },
  ],
  exports: [CartItemsFacade],
  imports: [DatabaseModule],
})
export class CartItemsModule {}
