import { User } from '../entities/user.entity';

type UserOrNull = User | null;

export interface IUserRepository {
  findById(id: string): Promise<UserOrNull>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  deleteById(id: string): Promise<UserOrNull>;
  findByEmail(email: string): Promise<UserOrNull>;
}
