import { IUseCase } from 'src/application/use-cases/base.use-case';
import { CartItems } from 'src/domain/entities/cart-items.entity';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { AddCartItemCommand } from 'src/application/command/cart-item/add-cart-item.command';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { InternalServerError } from 'src/application/errors/internal-server.error';
import { IUnitOfWork } from 'src/domain/repositories/unit-of-work.repository.interface';
import { IProductRepository } from 'src/domain/repositories/product.repository.interface';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class AddCartItemUseCase implements IUseCase<
  AddCartItemCommand,
  CartItems
> {
  constructor(
    private readonly _cartItemRepository: ICartItemsRepository,
    private readonly _cartRepo: ICartRepository,
    private readonly _uow: IUnitOfWork,
    private readonly _productRepo: IProductRepository,
  ) {}
  async execute(command: AddCartItemCommand): Promise<CartItems> {
    return await this._uow.runInTransaction(async (context) => {
      // create cart if not exists
      const cart = await this._cartRepo.createCart(context, command.userId);

      if (!cart || !cart.id) throw new InternalServerError();

      // check product

      const product = await this._productRepo.findProduct(command.productId);

      // findProduct run outside the transaction
      // But this has no effect cart doesn't preserve the quantity
      if (!product) throw new NotFoundError('Product not exist');

      const total = product.price * command.quantity;

      command.setCartId(cart.id);

      const cartItem = new CartItems(
        null,
        cart.id,
        command.productId,
        product.price,
        command.quantity,
        total,
      );

      return await this._cartItemRepository.addItem(context, cartItem);
    });
  }
}
