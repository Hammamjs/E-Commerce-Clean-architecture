import { User } from 'src/domain/entities/user.entity';

export class UserDto {
  id: string;
  fullName: string;
  createdAt: string;
  email: string;

  constructor(user: User) {
    this.fullName = user.fullName;
    this.email = user.email;
    if (user.createdAt) {
      this.createdAt = user.createdAt;
    }
    if (user.id) {
      this.id = user.id;
    }
  }
}
