import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user.entity';
import { Pool } from 'pg';
import { UserRow } from './user.row';
import { SQL } from './SQL';
import { HelperQuery } from '../shared/helper-query';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class PgUserRepository implements IUserRepository {
  constructor(
    private readonly _conn: Pool,
    private readonly _helperQuery: HelperQuery,
  ) {}

  private _columnMap = {
    fullName: 'full_name',
    email: 'email',
  };

  private readonly _allowedColumns = ['email', 'fullName'];

  private _toEntity(row: UserRow): User {
    return new User(row.fullName, row.email, row.id, row.createdAt);
  }

  async findAll(): Promise<User[]> {
    const { rows, rowCount } = await this._conn.query<UserRow>(SQL.findAll);
    if (rowCount === 0) return [];
    return rows.map((row) => this._toEntity(row));
  }

  async findById(id: string): Promise<User | null> {
    const { rows, rowCount } = await this._conn.query<UserRow>(SQL.findById, [
      id,
    ]);
    if (rowCount === 0) return null;
    return this._toEntity(rows[0]);
  }

  async create(user: User): Promise<User> {
    const { toUpdate, toUpdateSignature, values } = this._helperQuery.create(
      user,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows } = await this._conn.query<UserRow>(
      SQL.create(toUpdate, toUpdateSignature),
      values,
    );
    return this._toEntity(rows[0]);
  }

  async update(user: User): Promise<User> {
    const { toUpdate, values } = this._helperQuery.update(
      user,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows, rowCount } = await this._conn.query<UserRow>(
      SQL.update(toUpdate, values.length + 1),
      [...values, user.id],
    );

    if (rowCount === 0) throw new NotFoundError('User not found');

    return this._toEntity(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this._conn.query<UserRow>(SQL.findByEmail, [email]);

    return rows[0] ? this._toEntity(rows[0]) : null;
  }

  async deleteById(id: string): Promise<User> {
    const { rows } = await this._conn.query<UserRow>(SQL.delete, [id]);

    return this._toEntity(rows[0]);
  }
}
