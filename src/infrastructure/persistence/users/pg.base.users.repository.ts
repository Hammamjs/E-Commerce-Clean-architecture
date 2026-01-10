import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/infrastructure/database/pg-connection';
import { BaseRepository } from '../base.repository';
import { UserRow } from './user.row';

export class PgBaseUserRepository extends BaseRepository<UserRow> {
  protected columnMap = {
    fullName: 'full_name',
    email: 'email',
  };

  constructor(@Inject(PG_CONNECTION) conn: Pool) {
    super(conn, 'users', ['email', 'fullName']);
  }

  async getAllRows(): Promise<UserRow[]> {
    return this.conn
      .query<UserRow>(
        'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users',
      )
      .then((row) => row.rows);
  }

  async getByEmail(email: string): Promise<UserRow> {
    const query =
      'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE email = $1';
    const res = await this.conn.query<UserRow>(query, [email]);
    const row = res.rows[0];
    return row;
  }

  protected async getOne(id: string) {
    return this.conn
      .query<UserRow>(
        'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE id = $1',
        [id],
      )
      .then((row) => row.rows[0]);
  }

  protected update = async (id: string, data: Partial<UserRow>) => {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        value !== undefined && this.allowedColumns.includes(key),
    );

    const fieldsToUpdate = entries
      .map(([k], i) => `${this.columnMap[k]}=$${i + 1}`) // we need to make data match db
      .join(', ');
    const values = entries.map(([, v]) => v);

    return this.conn
      .query<UserRow>(
        `UPDATE users SET ${fieldsToUpdate} WHERE id = $${values.length + 1} RETURNING full_name AS "fullName", email, id `,
        [...values, id],
      )
      .then((data) => data.rows[0]);
  };

  protected create = async (data: Partial<UserRow>) => {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        value !== undefined && this.allowedColumns.includes(key),
    );

    const fields = entries.map(([k]) => `${this.columnMap[k]}`).join(', ');
    const fieldsCount = entries.map((item, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v);

    try {
      return this.conn
        .query<UserRow>(
          `INSERT INTO users (${fields}) VALUES (${fieldsCount}) RETURNING full_name AS "fullName", email, id, created_at "createdAt"`,
          values,
        )
        .then((res) => res.rows[0]);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  protected delete = async (id: string) => {
    return this.conn
      .query<UserRow>(
        'DELETE FROM users WHERE id = $1 RETURNING full_name AS "fullName", email, id ',
        [id],
      )
      .then((res) => res.rows[0]);
  };
}
