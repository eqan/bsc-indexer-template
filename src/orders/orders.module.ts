import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproveModule } from 'src/approval/approve.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { Tokens } from 'src/tokens/entities/tokens.entity';

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
    TypeOrmModule.forFeature([Orders, Tokens]),
    HttpModule.register({
      timeout: 40 * 1000, //40sec
      maxRedirects: 5,
    }),
    RpcProviderModule,
    UsdPricesModule,
    ApproveModule,
  ],
  providers: [OrdersResolver, OrdersService, OrdersHelpers, OrderPrices],
  exports: [OrdersService, OrderPrices],
})
export class OrdersModule {}
