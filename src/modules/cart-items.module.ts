import { forwardRef, Module } from '@nestjs/common';
import { AddCartItemUseCase } from 'src/application/use-cases/cart-items/add-items.use-case';
import { CartItemsFacade } from 'src/application/use-cases/cart-items/cart-item.facade';
import { FindAllCartItemsUseCase } from 'src/application/use-cases/cart-items/find-all-cart-items.use-case';
import { RemoveCartItemUseCase } from 'src/application/use-cases/cart-items/remove-item.use-case';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { PgCartItemsReposiory } from 'src/infrastructure/persistence/cart-items/pg.cart-items.repository';
import { CartItemsController } from 'src/interfaces/http/cart-items.controller';
import { DatabaseModule } from './Database.module';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { CartModule } from './cart.module';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { ProductsModule } from './products.module';
import { UnitOfWorkModule } from './unit-of-work.module';
import { AsyncContext } from 'src/infrastructure/persistence/async-context/async-context';

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
      useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
        new PgCartItemsReposiory(pool, asyncCtx),
      inject: [PG_CONNECTION],
    },
  ],
  exports: ['ICartItemsRepository', CartItemsFacade],
  // fix circular imports
  imports: [
    DatabaseModule,
    forwardRef(() => CartModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => UnitOfWorkModule),
  ],
})
export class CartItemsModule {}
