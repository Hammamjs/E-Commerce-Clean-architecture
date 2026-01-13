import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user.entity';
import { Pool } from 'pg';
import { UserRow } from './user.row';
import { SQL } from './SQL';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class PgUserRepository implements IUserRepository {
  constructor(private readonly _conn: Pool) {}

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

  async create(user: User): Promise<User | null> {
    const entries = this.validation(user);
    console.log('wrok');
    if (!entries.length) return null;

    const fields = entries.map(([k]) => `${this._columnMap[k]}`).join(', ');
    const fieldsCount = entries.map((item, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v as string);

    const { rows } = await this._conn.query<UserRow>(
      SQL.create(fields, fieldsCount),
      values,
    );
    return this._toEntity(rows[0]);
  }

  async update(user: User): Promise<User | null> {
    const entries = this.validation(user);
    if (!entries.length) return null;

    const fieldsToUpdate = entries
      .map(([k], i) => `${this._columnMap[k]}=$${i + 1}`) // we need to make data match db
      .join(', ');
    const values = entries.map(([, v]) => v as string);

    const { rows, rowCount } = await this._conn.query<UserRow>(
      SQL.update(fieldsToUpdate, values.length),
      [...values, user.id],
    );

    if (rowCount === 0) return null;

    return this._toEntity(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this._conn.query<UserRow>(SQL.findByEmail, [email]);

    return rows[0] ? this._toEntity(rows[0]) : null;
  }

  async deleteById(id: string): Promise<User | null> {
    const { rows, rowCount } = await this._conn.query<UserRow>(SQL.delete, [
      id,
    ]);
    if (rowCount === 0) return null;
    return this._toEntity(rows[0]);
  }

  private validation(user: User) {
    const entries = Object.entries(user).filter(
      ([key, value]) =>
        value !== undefined && this._allowedColumns.includes(key),
    );

    return entries;
  }
}
