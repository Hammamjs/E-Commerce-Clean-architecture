import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateCartItemDto } from '../dto/cart-itemsDto/create-cart-item.dto';
import { LoggerService } from 'src/logger/logger.service';
import type { Request } from 'express';
import { CartItemsFacade } from 'src/application/use-cases/cart-items/cart-item.facade';
import { AddCartItemCommand } from 'src/application/command/cart-item/add-cart-item.command';
import { RemoveCartItemCommand } from 'src/application/command/cart-item/remove-cart-items.command';

@Controller('cart-items')
export class CartItemsController {
  private readonly logger = new LoggerService(CartItemsController.name);
  constructor(private readonly cartItems: CartItemsFacade) {}

  @Get()
  async findAllCartItems(@Param('cartId') cartId: string) {
    return await this.cartItems.findAllItems.execute(cartId);
  }

  @Post('/add-item')
  async addItemToCart(@Req() req: Request, @Body() dto: CreateCartItemDto) {
    this.logger.logWithPayload(`Add Item to cart`, {
      ...req.logContext,
    });

    const command = new AddCartItemCommand(
      dto.userId,
      dto.productId,
      dto.quantity,
    );

    return this.cartItems.addItem.execute(command);
  }

  @Patch('/remove-item')
  async removeCartItem(@Body() createCartItemDto: CreateCartItemDto) {
    const command = new RemoveCartItemCommand(
      createCartItemDto.userId,
      createCartItemDto.productId,
      createCartItemDto.quantity,
    );
    return this.cartItems.removeItem.execute(command);
  }
}
