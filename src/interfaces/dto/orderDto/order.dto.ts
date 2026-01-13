import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from 'src/domain/enums/order-status.enum';

export class OrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsEnum(Status)
  status: Status;

  @IsOptional()
  total: number;

  @IsOptional()
  createdAt: string;
}
