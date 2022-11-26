import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { HelpersResolver } from './helpers.resolver';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [OrdersResolver, OrdersService, HelpersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
