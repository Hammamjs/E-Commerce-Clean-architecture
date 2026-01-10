import { IUseCase } from 'src/application/use-cases/base.use-case';
import { CartItems } from 'src/domain/entities/cart-items.entity';
import { ICartItemsRepository } from 'src/domain/repositories/cart-items.respository.interface';

export class FindAllCartItemsUseCase implements IUseCase<string, CartItems[]> {
  constructor(private cartItemRepository: ICartItemsRepository) {}
  async execute(cartId: string): Promise<CartItems[]> {
    if (!cartId) throw new Error('Cart id not provided');
    return this.cartItemRepository.findAllItemsForCart(cartId);
  }
}
