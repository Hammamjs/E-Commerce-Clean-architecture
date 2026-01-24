import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { OrderDto } from '../dto/orderDto/order.dto';
import { OrderFacade } from 'src/application/use-cases/order/order.facade';

import { UpdateOrderCommand } from 'src/application/command/order/update-order.command';
import { DeleteOrderCommand } from 'src/application/command/order/delete-order.command';

@Controller('orders')
export class OrdersController {
  constructor(private readonly _order: OrderFacade) {}

  @Patch('change-status')
  async updateOrderStatus(@Body() orderDto: OrderDto) {
    console.log(orderDto);

    return await this._order.update.execute(
      new UpdateOrderCommand(orderDto.id, orderDto.userId, orderDto.status),
    );
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this._order.deleteOrder.execute(new DeleteOrderCommand(id));
  }
}
