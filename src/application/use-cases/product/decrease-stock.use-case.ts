import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

type DecreaseType = { productId: string; quantity: number };
export class DecreaseProductStockUseCase implements IUseCase<
  DecreaseType,
  Products
> {
  constructor(private productsRepository: IProductRepository) {}

  async execute(data: DecreaseType): Promise<Products> {
    const { productId, quantity } = data;
    const product = await this.productsRepository.decreaseStock(
      productId,
      quantity,
    );

    return product;
  }
}
