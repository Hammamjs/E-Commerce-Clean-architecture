import { IUseCase } from 'src/application/use-cases/base.use-case';
import { UpdateProductCommand } from 'src/application/command/product/update-product.command';
import { Products } from 'src/domain/entities/products.entity';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';

export class UpdateProductUseCase implements IUseCase<
  UpdateProductCommand,
  Products
> {
  constructor(private productRespository: IProductRepository) {}
  async execute(data: UpdateProductCommand): Promise<Products> {
    if (!data.id) throw new Error('Product id not exists');

    const product = await this.productRespository.findProduct(data.id);

    if (!product) throw new Error('Product not found');

    if (data.name !== undefined) product.rename(data.name);
    if (data.price !== undefined) product.setPrice(data.price);
    if (data.inStock !== undefined) product.setStock(data.inStock);

    return await this.productRespository.update(product);
  }
}
