import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { FindUsersUseCase } from './find-users.use-case';
import { FindUserUseCase } from './find-user.use-case';
import { UpdateUserUseCase } from './update-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';

@Injectable()
export class UserFacade {
  constructor(
    readonly create: CreateUserUseCase,
    readonly findAll: FindUsersUseCase,
    readonly find: FindUserUseCase,
    readonly update: UpdateUserUseCase,
    readonly deleteUser: DeleteUserUseCase,
  ) {}
}
