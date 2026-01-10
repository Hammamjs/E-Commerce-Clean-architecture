import { PoolClient } from 'pg';

export interface IUnitOfWork {
  runInTransaction<T>(work: (context: PoolClient) => Promise<T>): Promise<T>;
}
