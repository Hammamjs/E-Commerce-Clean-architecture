import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/domain/enums/order-status.enum';

export class OrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsEnum(Status)
  status: Status;

  total: number;
  createdAt: string;
}
