import { Products } from '../entities/products.entity';

export interface IProductRepository {
  findProduct(productId: string): Promise<Products | null>;
  findAll(): Promise<Products[]>;
  save(product: Products): Promise<Products>;
  deleteProduct(productId: string): Promise<Products>;
  increaseStock(productId: string, quantity: number): Promise<Products>;
  decreaseStock(productId: string, quantity: number): Promise<Products>;
}
