import { AsyncLocalStorage } from 'async_hooks';
import { PoolClient } from 'pg';

export interface TransactionContext {
  client: PoolClient;
}

export class AsyncContext {
  private readonly _storage = new AsyncLocalStorage<TransactionContext>();

  run<T>(context: TransactionContext, callback: () => T) {
    return this._storage.run(context, callback);
  }

  getClient(): PoolClient | undefined {
    return this._storage.getStore()?.client;
  }

  isTransaction(): boolean {
    return !!this._storage.getStore();
  }
}

export const asyncContext = new AsyncContext();
