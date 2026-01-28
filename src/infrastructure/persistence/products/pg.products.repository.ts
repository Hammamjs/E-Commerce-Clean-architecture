import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { Pool, PoolClient } from 'pg';
import { Products } from 'src/domain/entities/products.entity';
import { asyncContext, AsyncContext } from '../async-context/async-context';
import { InsufficientQuantityError } from 'src/application/errors/insufficient.error';
import { SQL } from './SQL';
import { ProductRow } from './product.row';
import { HelperQuery } from '../shared/helper-query';

export class PgProductsRepository implements IProductRepository {
 constructor(
  private readonly _conn: Pool,
  private readonly _asyncContext: AsyncContext = asyncContext,
  private readonly _helperQuery: HelperQuery,
 ) { }

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
  const { rows, rowCount } = await client.query<ProductRow>(SQL.findAll);

  if (rowCount === 0) return [];

  return rows.map((row) => this._toEntity(row));
 }

 async findProduct(id: string): Promise<Products | null> {
  const client = this._getClient();
  const { rows } = await client.query<ProductRow>(SQL.findById, [id]);

  return this._toEntity(rows[0]);
 }

 async increaseStockWithTx(
  productId: string,
  quantity: number,
 ): Promise<{ inStock: number }> {
  const client = this._getClient();
  const { rows } = await client.query<{ inStock: number }>(
   SQL.increaseStock,
   [productId, quantity],
  );

  return rows[0];
 }

 async decreaseStockWithTx(
  productId: string,
  quantity: number,
 ): Promise<Products> {
  const client = this._getClient();
  const { rows: product } = await client.query<ProductRow>(SQL.dcreaseStock, [
   productId,
   quantity,
  ]);

  return this._toEntity(product[0]);
 }

 async create(product: Products): Promise<Products | null> {
  const { toUpdate, toUpdateSignature, values } = this._helperQuery.create(
   product,
   this._allowedColumns,
   this._columnMap,
  );

  const client = this._getClient();

  const { rows } = await client.query<ProductRow>(
   SQL.create(toUpdate, toUpdateSignature),
   values,
  );
  return this._toEntity(rows[0]);
 }

 async update(product: Products): Promise<Products | null> {
  const { toUpdate, values } = this._helperQuery.update(
   product,
   this._allowedColumns,
   this._columnMap,
  );

  const client = this._getClient();

  const { rows } = await client.query<ProductRow>(
   SQL.update(toUpdate, values.length + 1),
   values,
  );
  return this._toEntity(rows[0]);
 }

 async delete(id: string): Promise<Products> {
  const client = this._getClient();

  const { rows } = await client.query<ProductRow>(SQL.delete, [id]);
  return this._toEntity(rows[0]);
 }
}
