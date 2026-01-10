import { Status } from 'src/domain/enums/order-status.enum';

export class CartDto {
  id: string;
  userId: string;
  createdAt: Date;
  status: Status;
}
