import { CheckOutCommand } from 'src/application/command/checkout/check-out.command';
import { IUseCase } from '../base.use-case';
import { Orders } from 'src/domain/entities/orders.entity';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { IOrdersRepository } from 'src/domain/repositories/order.repository.interface';
import { IOrderItemsRepository } from 'src/domain/repositories/order-items.repository.interface';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { ForbiddenError } from 'src/application/errors/forbidden.error';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { NotFoundError } from 'src/application/errors/not-found.error';
import { InsufficientQuantityError } from 'src/application/errors/insufficient.error';
import { InternalServerError } from 'src/application/errors/internal-server.error';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';

export class CheckOutUseCase implements IUseCase<
 CheckOutCommand,
 { order: Orders; items: OrderItem[] }
> {
 constructor(
  private readonly _cartRep: ICartRepository,
  private readonly _cartItemsRepo: ICartItemsRepository,
  private readonly _userRepo: IUserRepository,
  private readonly _orderRep: IOrdersRepository,
  private readonly _orderItems: IOrderItemsRepository,
  private readonly _productRepo: IProductRepository,
  private readonly _uowRepo: IUnitOfWork,
 ) { }

 async execute(
  command: CheckOutCommand,
 ): Promise<{ order: Orders; items: OrderItem[] }> {
  return await this._uowRepo.runInTransaction(async () => {
   // All operation under transaction (one failed break the chain) Rollback occure

   // check if user exist
   const user = await this._userRepo.findById(command.userId);
   if (!user)
    throw new ForbiddenError(
     'Cannot perform this operation user not found',
    );
   // check cart if exist
   const cart = await this._cartRep.findByUserId(command.userId);
   if (!cart)
    throw new NotFoundError(
     'User has no cart to perform this operation cart not exists',
    );
   // check items for carts if empty stop operation
   if (!cart.id) throw new NotFoundError();
   const cartItem = await this._cartItemsRepo.findAllItemsForCart(cart.id);

   if (!cartItem.length) throw new NotFoundError('Cart empty');

   // clac total
   let total = 0;
   for (const item of cartItem) {
    // check product exist
    const product = await this._productRepo.findProduct(item.productId);

    if (!product)
     throw new NotFoundError(
      `Cannot processed ${item.productId} not found`,
     );

    // confirm product stock has enough quantity
    if (product.getInStock() < item.getQuantity())
     throw new InsufficientQuantityError(
      `Insuffiecent stock for ${product.name} only available last ${product.getInStock()} items`,
     );
    // decrease product stock
    await this._productRepo.decreaseStockWithTx(
     item.productId,
     item.getQuantity(),
    );
    total += item.getTotal();
   }
   // create order
   const order = await this._orderRep.createOrder(command.userId, total);
   if (!order) throw new InternalServerError();
   // create orderItems
   const orderItem = await this._orderItems.createFromCart(
    order.id,
    cart.id,
   );
   if (!orderItem) {
    // if order item not created so we need to delete the order itself
    // and keep cart to let user try the process again
    await this._orderRep.deleteOrder(order.id);
    throw new InternalServerError();
   }
   // update CartStause when order created
   cart.checkout();
   await this._cartRep.update(cart);
   // this operation occur when order created successfully
   await this._cartRep.delete(cart.id);

   // return order
   return {
    order,
    items: orderItem,
   };
  });
 }
}
