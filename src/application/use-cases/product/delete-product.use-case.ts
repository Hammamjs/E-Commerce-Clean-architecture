import { NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

export class DeleteProductUseCase implements IUseCase<string, Products> {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string): Promise<Products> {
    const product = await this.productRepository.findProduct(productId);
    if (!product) throw new NotFoundException('Product not exists');

    return await this.productRepository.deleteProduct(productId);
  }
}
