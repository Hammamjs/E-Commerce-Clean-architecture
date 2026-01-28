import { Module } from '@nestjs/common';
import { PgProductsRepository } from 'src/infrastructure/persistence/products/pg.products.repository';
import { ProductsController } from 'src/interfaces/http/products.controller';
import { ProductsFacade } from 'src/application/use-cases/product/products.facade';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { FindProductUseCase } from 'src/application/use-cases/product/find-product.use-case';
import { FindProductsUseCase } from 'src/application/use-cases/product/find-products.use-case';
import { CreateProductUseCase } from 'src/application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from 'src/application/use-cases/product/update-product.use-case';
import { IncreaseProductStockUseCase } from 'src/application/use-cases/product/increase-stock.use-case';
import { DeleteProductUseCase } from 'src/application/use-cases/product/delete-product.use-case';
import { DatabaseModule } from './Database.module';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';

@Module({
 controllers: [ProductsController],
 providers: [
  {
   provide: ProductsFacade,
   useFactory: (repo: IProductRepository, uowRepo: IUnitOfWork) => {
    const findProduct = new FindProductUseCase(repo);
    const findProducts = new FindProductsUseCase(repo);
    const create = new CreateProductUseCase(repo);
    const update = new UpdateProductUseCase(repo);
    const increaseStock = new IncreaseProductStockUseCase(repo, uowRepo);
    const deleteProduct = new DeleteProductUseCase(repo);

    return new ProductsFacade(
     create,
     update,
     findProduct,
     findProducts,
     increaseStock,
     deleteProduct,
    );
   },
   inject: ['IProductRepository'],
  },
  {
   provide: 'IProductRepository',
   useClass: PgProductsRepository,
  },
 ],
 exports: ['IProductRepository', ProductsFacade],
 imports: [DatabaseModule],
})
export class ProductsModule { }
