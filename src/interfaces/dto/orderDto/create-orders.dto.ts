import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { ItemStatus } from '../Order-itemDto/order-items-status';

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @IsPositive({ message: 'Total should be greater than one' })
  total: number;

  @IsNotEmpty()
  userId: string;
}
