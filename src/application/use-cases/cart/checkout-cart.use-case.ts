import { UpdateCartChekoutStatus } from 'src/application/command/cart/update-cart-checkout.command';
import { IUseCase } from 'src/application/use-cases/base.use-case';
import { Cart } from 'src/domain/entities/cart.entity';
import { Status } from 'src/domain/enums/order-status.enum';
import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';

export class CheckoutCartUseCase implements IUseCase<
  UpdateCartChekoutStatus,
  Cart | null
> {
  constructor(private cartRepository: ICartRepository) {}
  async execute(command: UpdateCartChekoutStatus) {
    if (!command.userId) throw new Error('User id not provided');
    const cart = await this.cartRepository.findByUserId(command.userId);

    if (!cart) throw new Error('Cart not exists');
    if (command.status === Status.CHECKEDOUT) {
      cart.checkout();
    }

    return this.cartRepository.update(cart);
  }
}
