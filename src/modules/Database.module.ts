import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';

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
  ],
  exports: [PG_CONNECTION],
  imports: [DatabaseModule],
})
export class DatabaseModule {}
