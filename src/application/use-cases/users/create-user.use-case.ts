import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { IUseCase } from '../base.use-case';
import { CreateUserCommand } from 'src/application/command/users/create-user.command';
import { ForbiddenError } from 'src/application/errors/forbidden.error';

export class CreateUserUseCase implements IUseCase<CreateUserCommand, User> {
  constructor(private _userRepository: IUserRepository) {}

  async execute(command: CreateUserCommand) {
    const existing = await this._userRepository.findByEmail(command.email);
    if (existing) throw new ForbiddenError('User already exist');

    const newUser = new User(command.fullName, command.email);

    return await this._userRepository.create(newUser);
  }
}
