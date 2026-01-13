import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { Pool } from 'pg';
import { Products } from 'src/domain/entities/products.entity';
import { ProductRow } from './product.row';
import { NotFoundException } from '@nestjs/common';
import { HelperQuery } from 'src/infrastructure/shared/helper-query';
import { SQL } from './SQL';

export class PgProductsRepository implements IProductRepository {
  constructor(
    private readonly _conn: Pool,
    private readonly _asyncContext: AsyncContext,
    private readonly _helperQuery: HelperQuery,
  ) {}

  private readonly _columnMap = {
    name: 'name',
    price: 'price',
    inStock: 'in_stock',
  };

  private readonly _allowedColumns = ['name', 'price', 'inStock'];

  private _toEntity(row: ProductRow): Products {
    return new Products(
      row.name,
      row.price,
      row.inStock,
      row.id,
      row.createdAt,
    );
  }

  async findAll(): Promise<Products[]> {
    const { rows: products } = await this._conn.query<ProductRow>(SQL.findAll);

    return products.map((product) => this._toEntity(product));
  }

  async findById(id: string): Promise<Products | null> {
    const { rows: productData } = await this._conn.query<ProductRow>(
      SQL.findById,
      [id],
    );

    return this._toEntity(productData[0]);
  }

  async increaseStock(productId: string, amount: number): Promise<Products> {
    await this.increaseStockTx(productId, amount);
    const row = await this.findOne(productId);
    if (!row) throw new Error('Product not found');
    return this._toEntity(row);
  }

  async decreaseStock(productId: string, amount: number): Promise<Products> {
    const res = await client.query<{ in_stock: number }>(
      `UPDATE products
    SET in_stock = in_stock - $2
    WHERE id = $1 AND in_stock >= $2
    RETURNING in_stock
    `,
      [productId, quantity],
    );

    if (res.rowCount === 0)
      throw new BadRequestException('Product not found or insufficient stock');
    await client.query('COMMIT');
    return res.rows[0].in_stock;
  }

  async update(product: Products): Promise<Products> {
    const { toUpdate, values } = this._helperQuery.update(
      product,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows: productData } = await this._conn.query<ProductRow>(
      SQL.update(toUpdate, values.length + 1),
      [...values, product.id],
    );
    return this._toEntity(productData[0]);
  }

  async create(product: Products): Promise<Products | null> {
    const { toUpdate, toUpdateSignature, values } = this._helperQuery.create(
      product,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows: productData } = await this._conn.query<ProductRow>(
      SQL.create(toUpdate, toUpdateSignature),
      values,
    );

    return this._toEntity(productData[0]);
  }

  async deleteProduct(productId: string): Promise<Products> {
    if (!productId) throw new NotFoundException('Product id not provided');
    const res = await this.findOne(productId);
    if (!res) throw new NotFoundException('Product not exists');
    const row = await this.delete(productId);
    return this._toEntity(row);
  }
}
