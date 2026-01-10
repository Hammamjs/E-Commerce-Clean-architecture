import { Status } from 'src/domain/enums/order-status.enum';

export interface CartRow {
  id: string;
  userId: string;
  status: Status;
  createdAt: string;
}
