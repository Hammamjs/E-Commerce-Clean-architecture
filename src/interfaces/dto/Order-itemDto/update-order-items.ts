import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from '../orderDto/create-orders.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderDto) {}
