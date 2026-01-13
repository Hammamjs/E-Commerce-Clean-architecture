import { NotFoundError } from 'src/application/errors/not-found.error';
import { IUseCase } from 'src/application/use-cases/base.use-case';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';

type IncreaseType = { productId: string; quantity: number };
type InStock = { inStock: number };
export class IncreaseProductStockUseCase implements IUseCase<
  IncreaseType,
  InStock
> {
  constructor(
    private _productsRepository: IProductRepository,
    private _uowRepo: IUnitOfWork,
  ) {}
  async execute(data: IncreaseType): Promise<InStock> {
    return await this._uowRepo.runInTransaction(async () => {
      const { productId, quantity } = data;
      const product = await this._productsRepository.increaseStockWitTx(
        productId,
        quantity,
      );

      if (!product)
        throw new NotFoundError('Product not found update value failed');

      return product;
    });
  }
}
