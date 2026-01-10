import { Products } from 'src/domain/entities/products.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  inStock: number;

  constructor(product: Products) {
    this.id = product.id ?? '';
    this.name = product.name;
    this.price = product.price;
    this.inStock = product.inStock;
  }
}
