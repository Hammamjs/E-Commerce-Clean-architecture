import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/command/users/create-user.command';
import { UpdateUserCommand } from 'src/application/command/users/update-user.command';
import { UserFacade } from 'src/application/use-cases/users/user.facade';
import { CreateUserDto } from 'src/interfaces/dto/usersDto/create-user.dto';
import { UpdateUserDto } from 'src/interfaces/dto/usersDto/update-user.dto';
import { UserDto } from 'src/interfaces/dto/usersDto/userDto';

@Controller('users')
export class UserController {
  constructor(private user: UserFacade) {}

  @Get()
  async findAll() {
    const users = await this.user.findAll.execute();
    console.log(users);
    return users.map((user) => new UserDto(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.user.find.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const command = new CreateUserCommand(dto.fullName, dto.email);
      return this.user.create.execute(command);
    } catch (err) {
      if (err instanceof Error && err.message === 'User already exist')
        throw new ConflictException(err.message);
    }

    throw new InternalServerErrorException('An unexpected error occured');
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const command = new UpdateUserCommand(
      id,
      updateUserDto.fullName,
      updateUserDto.email,
    );

    return this.user.update.execute(command);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.user.deleteUser.execute(id);
  }
}
