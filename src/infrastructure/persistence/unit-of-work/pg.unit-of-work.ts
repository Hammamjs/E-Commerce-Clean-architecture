import { Pool } from 'pg';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { asyncContext, AsyncContext } from '../async-context/async-context';

export class PgUnitOfWork implements IUnitOfWork {
  constructor(
    private readonly _pool: Pool,
    private readonly _asyncContext: AsyncContext = asyncContext,
  ) {}
  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    if (this._asyncContext.isTransaction()) {
      return fn();
    }

    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');
      const result = await this._asyncContext.run({ client }, () => fn());
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback failed ', rollbackErr);
      }
      throw err;
    } finally {
      client.release();
    }
  }
}
