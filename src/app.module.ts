import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './modules/cart.module';
import { ProductsModule } from './modules/products.module';
import { OrdersModule } from './modules/orders.module';
import { CartItemsModule } from './modules/cart-items.module';
import { LoggerModule } from './logger/logger.module';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import { OrderItemsModule } from './modules/order-items.module';
import { CheckOutModule } from './modules/check-out.module';

@Module({
  imports: [
    UsersModule,
    // make env file visible for whole project
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CartModule,
    ProductsModule,
    OrdersModule,
    CartItemsModule,
    LoggerModule,
    OrderItemsModule,
    CheckOutModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('');
  }
}
