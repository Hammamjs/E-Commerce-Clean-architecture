import { IUseCase } from 'src/application/use-cases/base.use-case';
import { CreateProductInput } from 'src/application/command/product/create-product';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

export class CreateProductUseCase implements IUseCase<
  CreateProductInput,
  Products | null
> {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductInput): Promise<Products | null> {
    const product = new Products(data.name, data.price, data.inStock);
    return this.productRepository.create(product);
  }
}
