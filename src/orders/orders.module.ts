import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { Orders } from './entities/orders.entity';
import { OrdersHelpers } from './helpers/orders.helpers';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), RpcProviderModule],
  providers: [OrdersResolver, OrdersService, OrdersHelpers],
  exports: [OrdersService],
})
export class OrdersModule {}
