export class CreateOrderItemCommand {
  constructor(
    public readonly orderId: string,
    public readonly cartId: string,
  ) {}
}
