import { IsEnum, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
enum Status {
  Active = 'active',
  Checked_out = 'checked_out',
}
export class CreateOrderDto {
  @IsOptional()
  @IsEnum(Status)
  status?: 'active' | 'checked_out';

  @IsPositive({ message: 'Total should be greater than one' })
  total: number;

  @IsNotEmpty()
  userId: string;
}
