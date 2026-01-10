import { User } from 'src/domain/entities/user.entity';
import { IUseCase } from '../base.use-case';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { UpdateUserCommand } from 'src/application/command/users/update-user.command';

export class UpdateUserUseCase implements IUseCase<UpdateUserCommand, User> {
  constructor(private userRepository: IUserRepository) {}
  async execute(command: UpdateUserCommand): Promise<User> {
    const { id } = command;
    if (!id) throw new Error('User id is required');

    const user = await this.userRepository.findById(id);

    if (!user) throw new Error('User not exist');

    if (command.email) user.changeEmail(command.email);
    if (command.fullName) user.changeName(command.fullName);

    return await this.userRepository.save(user);
  }
}
