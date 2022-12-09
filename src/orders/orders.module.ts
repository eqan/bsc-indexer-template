import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { Orders } from './entities/orders.entity';
import { Test } from './entities/test';
import { HelpersResolver } from './helpers.resolver';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), RpcProviderModule],
  providers: [OrdersResolver, OrdersService, HelpersResolver, Test],
  exports: [OrdersService],
})
export class OrdersModule {}
