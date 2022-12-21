import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from 'src/activities/activities.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { OrdersModule } from 'src/orders/orders.module';
import { BaseEventParams } from '../entities/entities.entity.base-event-params';
import { OrderCancelEvents } from '../entities/events.entity.order-cancel-events';
import { OrderMatchEvents } from '../entities/events.entity.order-match-events';
import { ERC1155Handler } from '../handlers/erc1155/erc1155.handler';
import { ERC721Handler } from '../handlers/erc721/erc721.handler';
import { OrderMatchHandler } from '../handlers/order/events.order.handler';
import { OrderCancelEventService } from '../service/events.service.order-cancel-events';
import { OrderMatchEventService } from '../service/events.service.order-match-events';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [
    CollectionsJobModule,
    RpcProviderModule,
    ActivitiesModule,
    OrdersModule,
    TypeOrmModule.forFeature([
      OrderMatchEvents,
      BaseEventParams,
      OrderCancelEvents,
    ]),
  ],
  providers: [
    SyncEventsService,
    ERC721Handler,
    ERC1155Handler,
    OrderMatchHandler,
    OrderMatchEventService,
    OrderCancelEventService,
  ],
  exports: [SyncEventsService, OrderMatchEventService, OrderCancelEventService],
})
export class SyncEventsModule {}
