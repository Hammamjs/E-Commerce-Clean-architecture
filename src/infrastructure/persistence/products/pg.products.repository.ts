import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { Pool } from 'pg';
import { PgBaseProductsRepository } from './pg.base.products.repository';
import { Products } from 'src/domain/entities/products.entity';
import { ProductRow } from './product.row';
import { NotFoundException } from '@nestjs/common';

export class PgProductsRepository
  extends PgBaseProductsRepository
  implements IProductRepository
{
  constructor(conn: Pool) {
    super(conn);
  }

  private toEntity(row: ProductRow): Products {
    return new Products(
      row.name,
      row.price,
      row.inStock,
      row.id,
      row.createdAt,
    );
  }

  async findAll(): Promise<Products[]> {
    const rows = await this.getAllRows();
    if (!rows.length) throw new Error('No Product found');
    return rows.map((row) => this.toEntity(row));
  }

  async findProduct(productId: string): Promise<Products | null> {
    const row = await this.findOne(productId);
    if (!row) throw new NotFoundException('product not found');
    return this.toEntity(row);
  }

  async increaseStock(productId: string, amount: number): Promise<Products> {
    await this.increaseStockTx(productId, amount);
    const row = await this.findOne(productId);
    if (!row) throw new Error('Product not found');
    return this.toEntity(row);
  }

  async decreaseStock(productId: string, amount: number): Promise<Products> {
    await this.decreaseStockTx(productId, amount);
    const row = await this.findOne(productId);
    if (!row) throw new Error('Product not found');
    return this.toEntity(row);
  }

  async save(product: Products): Promise<Products> {
    const res = product.id
      ? await this.update(product.id, {
          name: product.name,
          price: product.price,
        })
      : await this.create(product);
    return this.toEntity(res);
  }

  async deleteProduct(productId: string): Promise<Products> {
    if (!productId) throw new NotFoundException('Product id not provided');
    const res = await this.findOne(productId);
    if (!res) throw new NotFoundException('Product not exists');
    const row = await this.delete(productId);
    return this.toEntity(row);
  }
}
