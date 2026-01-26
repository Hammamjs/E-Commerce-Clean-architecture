import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { HelperQuery } from 'src/infrastructure/persistence/shared/helper-query';

@Module({
 providers: [
  {
   provide: PG_CONNECTION,
   useFactory: (config: ConfigService) => {
    return new Pool({
     user: config.getOrThrow('DB_USER'),
     host: config.getOrThrow('DB_HOST'),
     database: config.getOrThrow('DB_NAME'),
     port: config.getOrThrow('DB_PORT'),
     password: config.getOrThrow('DB_PASSWORD'),
    });

   },
   inject: [ConfigService],
  },
  HelperQuery
 ],
 exports: [PG_CONNECTION, HelperQuery],
 imports: [ConfigModule]
})
export class DatabaseModule { }
