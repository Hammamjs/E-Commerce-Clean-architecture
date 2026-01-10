import { Body, Controller, Get, Param } from '@nestjs/common';
import { CartItemsFacade } from 'src/application/use-cases/cart-items/cart-item.facade';
// import { CreateCartDto } from '../dto/cartDto/create-cart.dto';
import { CartFacade } from 'src/application/use-cases/cart/cart.facade';

@Controller('cart')
export class CartController {
  constructor(private readonly _cart: CartFacade) {}

  @Get()
  findAll() {
    return this._cart.findAll.execute();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const { cart, items } = await this._cart.userCartWithItems.execute(userId);
    return {
      cart,
      items,
    };
  }

  // @Post()
  // async create(@Body() createCartDto: CreateCartDto) {
  //   return this.cart.create.execute(createCartDto);
  // }
}
