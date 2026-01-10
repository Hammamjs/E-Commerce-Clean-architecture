import { NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

export class FindProductsUseCase implements IUseCase<[], Products[]> {
  constructor(private productsRepository: IProductRepository) {}
  async execute(): Promise<Products[]> {
    const products = await this.productsRepository.findAll();
    if (!products.length) throw new NotFoundException('No products exists');
    return products;
  }
}
