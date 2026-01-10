import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { IUseCase } from '../base.use-case';
import { User } from 'src/domain/entities/user.entity';

export class FindUsersUseCase implements IUseCase<void, User[]> {
  constructor(private userRepository: IUserRepository) {}
  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
