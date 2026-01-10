import { Status } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';

export class Orders {
  constructor(
    public id: string,
    public userId: string,
    public status: Status,
    public total: number,
    public items: OrderItem[],
  ) {}

  computeTotal() {
    return this.items.reduce((sum, item) => sum + item.unitPrice, 0);
  }

  addItem(item: OrderItem) {
    this.items.push(item);
    this.total = this.computeTotal();
  }

  removeItem(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.total = this.computeTotal();
  }
}
