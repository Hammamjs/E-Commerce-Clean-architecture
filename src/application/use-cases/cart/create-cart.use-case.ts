// import { CreateCartCommand } from 'src/application/command/cart/create-cart.command';
// import { IUseCase } from 'src/application/use-cases/base.use-case';
// import { Cart } from 'src/domain/entities/cart.entity';
// import { ICartRepository } from 'src/domain/repositories/cart.repository.interface';

// export class CreateCartUseCase implements IUseCase<CreateCartCommand, Cart> {
//   constructor(private _cartRepository: ICartRepository) {}
//   async execute(command: CreateCartCommand): Promise<Cart> {
//     return this._cartRepository.createCart(command.userId);
//   }
// }
