import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { OrderItemDto } from '../dto/Order-itemDto/order-items.dto';
import { OrderItemFacade } from 'src/application/use-cases/order-items/order-item.facade';
import { FindUserOrdersItemQuery } from 'src/application/queries/order-items/find-user-orders-items.query';
import { ItemStatus } from '../dto/Order-itemDto/order-items-status';
import { OrderItemsResponse } from '../dto/Order-itemDto/order-item-response';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { UpdateOrderItemStatusCommand } from 'src/application/command/order-item/update-order-item-status.command';
import { FindItemQuery } from 'src/application/queries/order-items/find-item.query';
import { OrderResponse } from '../dto/orderDto/order-response';
import { Orders } from 'src/domain/entities/orders.entity';
import { UpdateOrderItemDto } from '../dto/Order-itemDto/update-order-items';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly _orderItem: OrderItemFacade) {}

  @Get('/item/:itemId')
  async findItem(@Param('itemId') itemId: string) {
    const item = await this._orderItem.findItem.execute(
      new FindItemQuery(itemId),
    );
    if (!item)
      throw new NotFoundException(`Item with this id: ${itemId} not found`);
    return this._toOrderItemResponse(item);
  }

  @Get('user/:userId')
  async getUserOrders(
    @Param('userId') userId: string,
    @Query('status') status?: ItemStatus,
  ) {
    const orderItem = await this._orderItem.findOrderItems.execute(
      new FindUserOrdersItemQuery(userId, status),
    );
    const { items, orders } = orderItem;
    const dto = this.responseMapper(orders, items);
    return dto;
  }

  @Patch('/update-item-status')
  async updateItemStatus(@Body() orderItemDto: OrderItemDto) {
    const { id, status } = orderItemDto;
    const updatedItem = await this._orderItem.updateStatus.execute(
      new UpdateOrderItemStatusCommand(id, status),
    );

    if (!updatedItem)
      throw new InternalServerErrorException('Update status failed');

    return updatedItem;
  }

  @Patch('update-status')
  async updateStatus(@Body() item: UpdateOrderItemDto) {
    console.log(item);
    if (!item.id || !item.status)
      throw new BadRequestException('Invalid input');

    const command = new UpdateOrderItemStatusCommand(item.id, item.status);
    const orderItem = await this._orderItem.updateStatus.execute(command);
    return this._toOrderItemResponse(orderItem);
  }

  private _toOrderItemResponse(item: OrderItem): OrderItemsResponse {
    return new OrderItemsResponse(
      item.id,
      item.orderId,
      item.productId,
      item.unitPrice,
      item.quantity,
      item.createdAt,
      item.status,
    );
  }

  private responseMapper(orders: Orders[], items: OrderItem[]) {
    return orders.map((order) => ({
      order: new OrderResponse(order.id, order.total, order.status),
      items: items
        .filter((i) => i.orderId === order.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((i) => this._toOrderItemResponse(i)),
    }));
  }
}
