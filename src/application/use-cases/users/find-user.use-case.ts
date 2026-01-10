import { User } from 'src/domain/entities/user.entity';
import { IUseCase } from '../base.use-case';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';

export class FindUserUseCase implements IUseCase<string, User> {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new Error('User not exists');

    return user;
  }
}
