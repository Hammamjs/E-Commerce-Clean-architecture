import { Products } from '../entities/products.entity';

export interface IProductRepository {
 findProduct(productId: string): Promise<Products | null>;
 findAll(): Promise<Products[]>;
 create(product: Products): Promise<Products | null>;
 update(product: Products): Promise<Products | null>;
 delete(productId: string): Promise<Products | null>;
 increaseStockWithTx(
  productId: string,
  quantity: number,
 ): Promise<{ inStock: number }>;
 decreaseStockWithTx(productId: string, quantity: number): Promise<Products>;
}
