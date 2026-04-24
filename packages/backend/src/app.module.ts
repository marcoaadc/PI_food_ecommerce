import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module.js';
import configuration from './config/configuration.js';
import { validationSchema } from './config/validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    AddressesModule,
    PaymentMethodsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
