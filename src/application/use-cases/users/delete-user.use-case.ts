import { User } from 'src/domain/entities/user.entity';
import { IUseCase } from '../base.use-case';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';

export class DeleteUserUseCase implements IUseCase<string, User> {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string) {
    if (!id) throw new Error('User id is required');
    const deletedUser = await this.userRepository.deleteById(id);
    if (!deletedUser) throw new Error('User not exists');
    return deletedUser;
  }
}
