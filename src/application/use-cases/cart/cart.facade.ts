// import { CreateCartUseCase } from './create-cart.use-case';
import { FindCartUseCase } from './find-cart.use-case';
import { CheckoutCartUseCase } from './checkout-cart.use-case';
import { UserCartWithItemsUseCase } from './user-cart-with-items.use-case';

export class CartFacade {
  constructor(
    readonly userCartWithItems: UserCartWithItemsUseCase,
    readonly checkout: CheckoutCartUseCase,
    readonly findCart: FindCartUseCase,
  ) {}
}
