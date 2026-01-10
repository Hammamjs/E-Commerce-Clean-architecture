import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Cart } from 'src/domain/entities/cart.entity';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';

export class DeleteCartUseCase implements IUseCase<string, Cart> {
  constructor(private readonly cartRepository: ICartRepository) {}
  async execute(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new Error('Cart not found');
    return this.cartRepository.deleteById(cart.id!);
  }
}
