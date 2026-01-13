import { Products } from '../entities/products.entity';

export interface IProductRepository {
  findProduct(productId: string): Promise<Products | null>;
  findAll(): Promise<Products[]>;
  create(product: Products): Promise<Products | null>;
  update(product: Products): Promise<Products | null>;
  deleteProduct(productId: string): Promise<Products | null>;
  increaseStockWitTx(
    productId: string,
    quantity: number,
  ): Promise<{ inStock: number }>;
  decreaseStockWitTx(productId: string, quantity: number): Promise<Products>;
}
