import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { PgUnitOfWork } from 'src/infrastructure/persistence/unit-of-work/pg.unit-of-work';
import { DatabaseModule } from './Database.module';
import { AsyncContext } from 'src/infrastructure/persistence/async-context/async-context';

@Module({
  providers: [
    {
      provide: 'IUnitOfWork',
      useFactory: (pool: Pool, asyncCtx: AsyncContext) =>
        new PgUnitOfWork(pool, asyncCtx),
      inject: [PG_CONNECTION],
    },
  ],
  exports: ['IUnitOfWork'],
  imports: [DatabaseModule],
})
export class UnitOfWorkModule {}
