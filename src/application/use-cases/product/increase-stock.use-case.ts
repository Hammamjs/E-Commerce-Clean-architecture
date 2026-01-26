import { NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

type IncreaseType = { productId: string; quantity: number };

export class IncreaseProductStockUseCase implements IUseCase<
  IncreaseType,
  Products
> {
  constructor(private productsRepository: IProductRepository) {}
  async execute(data: IncreaseType): Promise<Products> {
    const { productId, quantity } = data;
    const product = await this.productsRepository.increaseStockWithTx(
      productId,
      quantity,
    );

    if (!product)
      throw new NotFoundException('Product not found update value failed');

    return product;
  }
}
