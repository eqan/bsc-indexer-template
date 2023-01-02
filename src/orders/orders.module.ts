import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';

import { UsdPricesModule } from 'src/usd-prices/usd-prices.module';
import { Orders } from './entities/orders.entity';
import { OrdersHelpers } from './helpers/orders.helpers';
import { OrderPrices } from './helpers/orders.helpers.order-prices';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

/**
 * @OrdersModule
 * module for filtering and storing order related activities eg; auction,biding
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    HttpModule.register({
      timeout: 40 * 1000, //40sec
      maxRedirects: 5,
    }),
    RpcProviderModule,
    UsdPricesModule,
  ],
  providers: [OrdersResolver, OrdersService, OrdersHelpers, OrderPrices],
  exports: [OrdersService, OrderPrices, OrdersService],
})
export class OrdersModule {}
