import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { Pool, PoolClient } from 'pg';
import { Products } from 'src/domain/entities/products.entity';
import { asyncContext, AsyncContext } from '../async-context/async-context';
import { InsufficientQuantityError } from 'src/application/errors/insufficient.error';
import { InternalServerError } from 'src/application/errors/internal-server.error';
import { SQL } from './SQL';
import { ProductRow } from './product.row';

export class PgProductsRepository implements IProductRepository {
  constructor(
    private readonly _conn: Pool,
    private readonly _asyncContext: AsyncContext = asyncContext,
  ) {}

  private readonly _allowedColumns = ['name', 'price', 'inStock'];
  private readonly _columnMap = {
    name: 'name',
    price: 'price',
    in_stock: 'inStock',
  };

  private _getClient(): Pool | PoolClient {
    return this._asyncContext.getClient() ?? this._conn;
  }

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
    const client = this._getClient();
    const { rows, rowCount } = await client.query<ProductRow>(SQL.findAllQuery);

    if (rowCount === 0) return [];

    return rows.map((row) => this._toEntity(row));
  }

  async findProduct(id: string): Promise<Products | null> {
    const client = this._getClient();
    const { rows, rowCount } = await client.query<ProductRow>(
      SQL.findOneQuery,
      [id],
    );

    if (rowCount === 0) return null;

    return this._toEntity(rows[0]);
  }

  async increaseStockWitTx(
    productId: string,
    quantity: number,
  ): Promise<{ inStock: number }> {
    const client = this._getClient();
    const { rowCount, rows } = await client.query<{ inStock: number }>(
      SQL.increaseStockQuery,
      [productId, quantity],
    );

    if (rowCount === 0) throw new InternalServerError();

    return rows[0];
  }

  async decreaseStockWitTx(productId: string, quantity: number): Promise<void> {
    const client = this._getClient();
    const { rowCount } = await client.query<{ in_stock: number }>(
      SQL.dcreaseStockQuery,
      [productId, quantity],
    );

    if (rowCount === 0) throw new InsufficientQuantityError();

    return;
  }

  async create(product: Products): Promise<Products | null> {
    const { fields, fieldsCount, values } =
      this._createProductValidation(product);

    if (!values.length) return null;

    const client = this._getClient();

    const { rows } = await client.query<ProductRow>(
      SQL.createQuery(fields, fieldsCount),
      values,
    );
    return this._toEntity(rows[0]);
  }

  async update(product: Products): Promise<Products | null> {
    const { fields, values } = this._updateProductValidation(product);

    if (!fields || !values.length) return null;

    const client = this._getClient();

    const { rows } = await client.query<ProductRow>(
      `
       UPDATE products SET ${fields} WHERE id = $${values.length + 1} RETURNING id, name, price, in_stock AS "inStock", created_at AS "createdAt"
       `,
      [...values, product.id],
    );
    return this._toEntity(rows[0]);
  }

  async deleteProduct(id: string): Promise<Products | null> {
    const client = this._getClient();

    const { rows, rowCount } = await client.query<ProductRow>(
      SQL.deleteOneQuery,
      [id],
    );
    if (rowCount === 0) return null;
    return this._toEntity(rows[0]);
  }

  // ******* Helper utilty ************

  private _updateProductValidation(data: Products) {
    const entries = Object.entries(data).filter(
      ([k, v]) => v !== undefined && this._allowedColumns.includes(k),
    );

    const fields = entries
      .map(([k], i) => `${this._columnMap[k]} = $${i + 1}`)
      .join(', ');
    const values = entries.map(([, v]) => v as string);

    return {
      fields,
      values,
    };
  }

  private _createProductValidation(product: Products) {
    const entries = Object.entries(product).filter(
      ([k, v]) => v !== undefined && this._allowedColumns.includes(k),
    );

    const fields = entries.map(([k]) => `${this._columnMap[k]}`).join(', ');
    const fieldsCount = entries.map((_, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v as string);

    return {
      fields,
      fieldsCount,
      values,
    };
  }
}
