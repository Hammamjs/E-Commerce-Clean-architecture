import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user.entity';
import { UserRow } from './user.row';
import { Pool } from 'pg';
import { HelperQuery } from 'src/infrastructure/shared/helper-query';
import { SQL } from './SQL';

export class PgUserRepository implements IUserRepository {
  private readonly _columnMap = { fullName: 'full_name', email: 'email' };
  private readonly _allowedColumns = ['email', 'fullName'];

  constructor(
    private readonly _conn: Pool,
    private readonly _helperQuery: HelperQuery,
  ) {}

  private _toEntity(row: UserRow) {
    return new User(row.fullName, row.email, row.id, row.createdAt);
  }

  async findAll() {
    const { rows: users } = await this._conn.query<UserRow>(SQL.findAll);
    return users.map((user) => this._toEntity(user));
  }

  async findById(id: string) {
    const { rows: user } = await this._conn.query<UserRow>(SQL.findById, [id]);
    return this._toEntity(user[0]);
  }

  async create(user: User): Promise<User> {
    const { toUpdate, toUpdateSignature, values } = this._helperQuery.create(
      user,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows: userData } = await this._conn.query<UserRow>(
      SQL.create(toUpdate, toUpdateSignature),
      values,
    );
    return this._toEntity(userData[0]);
  }

  async update(user: User): Promise<User> {
    const { toUpdate, values } = this._helperQuery.update(
      user,
      this._allowedColumns,
      this._columnMap,
    );

    const { rows: userData } = await this._conn.query<UserRow>(
      SQL.update(toUpdate, values.length + 1),
      [...values, user.id],
    );
    return this._toEntity(userData[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows: user } = await this._conn.query<UserRow>(SQL.findByEmail, [
      email,
    ]);
    return this._toEntity(user[0]);
  }

  async deleteById(id: string): Promise<User> {
    const { rows: deletedUser } = await this._conn.query<UserRow>(SQL.delete, [
      id,
    ]);
    return this._toEntity(deletedUser[0]);
  }
}
