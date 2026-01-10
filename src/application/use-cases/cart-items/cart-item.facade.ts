import { AddCartItemUseCase } from './add-items.use-case';
import { FindAllCartItemsUseCase } from './find-all-cart-items.use-case';
import { RemoveCartItemUseCase } from './remove-item.use-case';

export class CartItemsFacade {
  constructor(
    readonly removeItem: RemoveCartItemUseCase,
    readonly addItem: AddCartItemUseCase,
    readonly findAllItems: FindAllCartItemsUseCase,
  ) {}
}
