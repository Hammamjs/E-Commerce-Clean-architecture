import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create-user.use-case';
import { DeleteUserUseCase } from 'src/application/use-cases/users/delete-user.use-case';
import { FindUserUseCase } from 'src/application/use-cases/users/find-user.use-case';
import { FindUsersUseCase } from 'src/application/use-cases/users/find-users.use-case';
import { UpdateUserUseCase } from 'src/application/use-cases/users/update-user.use-case';
import { UserFacade } from 'src/application/use-cases/users/user.facade';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { PgUserRepository } from 'src/infrastructure/persistence/users/pg.user.repository';
import { UserController } from 'src/interfaces/http/users.controller';
import { DatabaseModule } from './Database.module';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserFacade,
      useFactory: (repo: IUserRepository) =>
        new UserFacade(
          new CreateUserUseCase(repo),
          new FindUsersUseCase(repo),
          new FindUserUseCase(repo),
          new UpdateUserUseCase(repo),
          new DeleteUserUseCase(repo),
        ),
      inject: ['IUserRepository'],
    },
    {
      provide: 'IUserRepository',
      useClass: PgUserRepository,
    },
  ],
  exports: [UserFacade],
  imports: [DatabaseModule],
})
export class UsersModule {}
