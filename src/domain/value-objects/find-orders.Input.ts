import { IsNotEmpty } from 'class-validator';

export class FindUserOrdersInput {
  @IsNotEmpty()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
