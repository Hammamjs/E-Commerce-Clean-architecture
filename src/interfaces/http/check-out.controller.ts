import { Body, Controller, Post } from '@nestjs/common';
import { CheckOutUseCase } from 'src/application/use-cases/check-out/check-out.use-case';
import { CheckOutDto } from '../dto/check-outDto/check-out.dto';
import { CheckOutCommand } from 'src/application/command/checkout/check-out.command';
import { CheckOutResponse } from '../dto/check-outDto/check-out-response';
import { OrderItemsResponse } from '../dto/Order-itemDto/order-item-response';
import { OrderResponse } from '../dto/orderDto/order-response';

@Controller('check-out')
export class CheckOutController {
  constructor(private readonly _checkOut: CheckOutUseCase) {}

  @Post('/order')
  async checkout(@Body() checkoutDto: CheckOutDto): Promise<CheckOutResponse> {
    const command = new CheckOutCommand(checkoutDto.userId);
    const { order, items } = await this._checkOut.execute(command);
    return {
      order: new OrderResponse(order.id, order.total, order.status),
      items: items.map(
        (item) =>
          new OrderItemsResponse(
            item.id,
            item.orderId,
            item.productId,
            item.unitPrice,
            item.quantity,
            item.createdAt,
            item.status,
          ),
      ),
    };
  }
}
