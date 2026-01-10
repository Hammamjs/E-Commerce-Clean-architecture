import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderCommand {
  @IsNotEmpty()
  userId: string;

  @IsPositive()
  total: number;

  constructor(userId: string, total: number) {
    this.userId = userId;
    this.total = total;
  }
}
