import { CreateProductUseCase } from './create-product.use-case';
import { DecreaseProductStockUseCase } from './decrease-stock.use-case';
import { DeleteProductUseCase } from './delete-product.use-case';
import { FindProductUseCase } from './find-product.use-case';
import { FindProductsUseCase } from './find-products.use-case';
import { IncreaseProductStockUseCase } from './increase-stock.use-case';
import { UpdateProductUseCase } from './update-product.use-case';

export class ProductsFacade {
  constructor(
    public create: CreateProductUseCase,
    public update: UpdateProductUseCase,
    public findProduct: FindProductUseCase,
    public findProducts: FindProductsUseCase,
    public increaseStock: IncreaseProductStockUseCase,
    public decreaseStock: DecreaseProductStockUseCase,
    public deleteProduct: DeleteProductUseCase,
  ) {}
}
