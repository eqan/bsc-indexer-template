import { Module } from '@nestjs/common';
import { ActivitiesModule } from 'src/activities/activities.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { OrdersModule } from 'src/orders/orders.module';
import { UsdPricesModule } from 'src/usd-prices/usd-prices.module';
import { ERC1155Handler } from '../handlers/erc1155/erc1155.handler';
import { ERC721Handler } from '../handlers/erc721/erc721.handler';
import { OrderMatchHandler } from '../handlers/order/order.handler';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [
    CollectionsJobModule,
    RpcProviderModule,
    ActivitiesModule,
    OrdersModule,
  ],
  providers: [
    SyncEventsService,
    ERC721Handler,
    ERC1155Handler,
    OrderMatchHandler,
  ],
  exports: [SyncEventsService],
})
export class SyncEventsModule {}
