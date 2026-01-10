import { CartDto } from './cart.dto';

export interface Items {
  id: string;
  productId: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export class CartWithItems {
  cart: CartDto;
  items: Items[];
}
