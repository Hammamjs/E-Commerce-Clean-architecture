import { Products } from '../entities/products.entity';

export interface IProductRepository {
  findProduct(productId: string): Promise<Products | null>;
  findAll(): Promise<Products[]>;
  create(product: Products): Promise<Products>;
  update(product: Products): Promise<Products>;
  delete(productId: string): Promise<Products>;
  increaseStockWithTx(
    productId: string,
    quantity: number,
  ): Promise<Products>;
  decreaseStockWithTx(productId: string, quantity: number): Promise<Products>;
}
