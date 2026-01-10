import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user.entity';
import { UserRow } from './user.row';
import { Pool } from 'pg';
import { PgBaseUserRepository } from './pg.base.users.repository';

export class PgUserRepository
  extends PgBaseUserRepository
  implements IUserRepository
{
  protected columnMap = { fullName: 'full_name', email: 'email' };

  constructor(conn: Pool) {
    super(conn);
  }

  private toEntity(row: UserRow) {
    return new User(row.fullName, row.email, row.id, row.createdAt);
  }

  async findAll() {
    const rows = await super.getAllRows();
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string) {
    const row = await this.getOne(id);
    return row ? this.toEntity(row) : null;
  }

  async save(user: User): Promise<User> {
    let row: UserRow;
    if (user.id) {
      const exists = await this.findById(user.id);
      row = exists
        ? await this.update(user.id, {
            email: user.email,
            fullName: user.fullName,
          })
        : await this.create({ email: user.email, fullName: user.fullName });
    } else {
      row = await this.create({ email: user.email, fullName: user.fullName });
    }

    return this.toEntity(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.getByEmail(email);
    return row ? this.toEntity(row) : null;
  }

  async deleteById(id: string): Promise<User | null> {
    const row = await this.delete(id);

    return this.toEntity(row);
  }
}
