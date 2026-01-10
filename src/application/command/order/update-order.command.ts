import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/domain/enums/order-status.enum';

export class UpdateOrderCommand {
  @IsNotEmpty()
  orderId: string;
  @IsNotEmpty()
  userId: string;

  @IsEnum(Status)
  status: Status;

  constructor(orderId: string, userId: string, status: Status) {
    this.orderId = orderId;
    this.userId = userId;
    this.status = status;
  }
}
