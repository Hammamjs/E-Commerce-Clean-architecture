import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Cart } from 'src/domain/entities/cart.entity';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';

export class FindCartsUseCase implements IUseCase<void, Cart[]> {
  constructor(readonly cartRepository: ICartRepository) {}
  async execute(): Promise<Cart[]> {
    const carts = await this.cartRepository.findAll();
    if (!carts.length) throw new Error('No carts found');
    return carts;
  }
}
