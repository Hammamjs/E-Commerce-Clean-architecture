import { Pool, QueryResultRow } from 'pg';
import { SqlBuilder } from '../database/sql-builder';

export abstract class BaseRepository<
  T extends QueryResultRow & Record<string, any>,
> {
  protected abstract columnMap: Record<string, any>;

  constructor(
    protected readonly conn: Pool,
    protected readonly tableName: string,
    protected readonly allowedColumns: readonly string[],
  ) {}

  protected create = async (data: Partial<T>): Promise<T> => {
    const { query, values } = SqlBuilder.buildCreate(
      this.tableName,
      data,
      this.allowedColumns,
      this.columnMap,
    );

    const res = await this.conn.query<T>(query, values);

    return res.rows[0] ?? null;
  };

  public async getAllRows() {
    const query = `SELECT * FROM ${this.tableName};`;
    const res = await this.conn.query<T>(query);
    return res.rows;
  }

  protected findOne = async (id: string): Promise<T | null> => {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1;`;
    const res = await this.conn.query<T>(query, [id]);
    return res.rows[0] ?? null;
  };

  protected update = async (id: string, data: Partial<T>) => {
    const { query, values } = SqlBuilder.buildUpdate(
      this.tableName,
      id,
      data,
      this.allowedColumns,
      this.columnMap,
    );
    const res = await this.conn.query<T>(query, values);
    return res.rows[0] ?? null;
  };

  // This is hard delete we can make a soft-delete *** KEEP IN MIND ***
  protected delete = async (id: string) => {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
    const res = await this.conn.query<T>(query, [id]);
    return res.rows[0] ?? null;
  };
}
