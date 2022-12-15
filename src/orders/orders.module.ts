import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { Orders } from './entities/orders.entity';
import { HelpersResolver } from './helpers.resolver';
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
    RpcProvider,
  ],
  providers: [OrdersResolver, OrdersService, HelpersResolver, OrderPrices],
  exports: [OrdersService],
})
export class OrdersModule {}
