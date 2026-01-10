import { Inject } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';

export class PgUnitOfWork implements IUnitOfWork {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}
  async runInTransaction<T>(
    work: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error(rollbackErr);
      }
      throw err;
    } finally {
      client.release();
    }
  }
}
