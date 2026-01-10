import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { OrderDto } from '../dto/orderDto/order.dto';
import { OrderFacade } from 'src/application/use-cases/order/order.facade';

import { UpdateOrderCommand } from 'src/application/command/order/update-order.command';
import { DeleteOrderCommand } from 'src/application/command/order/delete-order.command';
import { Status } from 'src/domain/enums/order-status.enum';
import { FindUserOrderByIdQuery } from 'src/application/queries/order/find-user-order-by-id.query';

@Controller('orders')
export class OrdersController {
  constructor(private readonly _order: OrderFacade) {}

  @Get('user/:userId')
  async findUserOrder(
    @Param('userId') userId: string,
    @Query('status') status?: Status,
  ) {}

  @Patch('change-status')
  async updateOrderStatus(@Body() orderDto: OrderDto) {
    return await this._order.update.execute(
      new UpdateOrderCommand(orderDto.id, orderDto.userId, orderDto.status),
    );
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this._order.deleteOrder.execute(new DeleteOrderCommand(id));
  }
}
