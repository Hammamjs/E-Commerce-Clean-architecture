import { IsUUID } from 'class-validator';
import { ItemStatus } from 'src/domain/enums/order-item-status.enum';

export class OrderItemDto {
  @IsUUID()
  id: string;
  @IsUUID()
  orderId: string;
  @IsUUID()
  productId: string;

  unitPrice: number;
  quantity: number;
  createdAt: Date;
  status: ItemStatus;
}
