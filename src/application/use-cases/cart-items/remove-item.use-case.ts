import { IUseCase } from 'src/application/use-cases/base.use-case';
import { RemoveCartItemCommand } from 'src/application/command/cart-item/remove-cart-items.command';
import { CartItems } from 'src/domain/entities/cart-items.entity';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';
import { NotFoundError } from 'src/application/errors/not-found.error';

export class RemoveCartItemUseCase implements IUseCase<
  RemoveCartItemCommand,
  CartItems
> {
  constructor(
    private cartItemRepository: ICartItemsRepository,
    private cartRepository: ICartRepository,
  ) {}
  async execute(command: RemoveCartItemCommand): Promise<CartItems> {
    const cart = await this.cartRepository.findByUserId(command.userId);

    if (!cart) throw new NotFoundError('No cart found for this user');

    // Fetch item
    const items = await this.cartItemRepository.findAllItemsForCart(cart.id);
    const itemContent = items.find((i) => i.productId === command.productId);

    // Check if item exist
    if (!itemContent) throw new Error('Item not found');

    const cartItem = new CartItems(
      itemContent.id,
      cart.id,
      command.productId,
      itemContent?.getUnitPrice(),
      command.quantity,
    );

    return this.cartItemRepository.removeItem(cartItem);
  }
}
