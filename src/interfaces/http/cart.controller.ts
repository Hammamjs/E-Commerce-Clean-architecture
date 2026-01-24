import { Body, Controller, Get, Param } from '@nestjs/common';
import { CartFacade } from 'src/application/use-cases/cart/cart.facade';

@Controller('cart')
export class CartController {
  constructor(private readonly _cart: CartFacade) {}

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const { cart, items } = await this._cart.userCartWithItems.execute(userId);
    return {
      cart,
      items,
    };
  }
}
