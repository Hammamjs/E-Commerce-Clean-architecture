import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Status } from 'src/domain/enums/order-status.enum';

export interface OrderRow {
  id: string;
  userId: string;
  status: Status;
  total: number;
  createdAt: string;
  quantity: number;
  items: OrderItem[];
}
