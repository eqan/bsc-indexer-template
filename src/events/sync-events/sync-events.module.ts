import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from 'src/activities/activities.module';
import { CollectionsRegistrationModule } from 'src/CollectionRegistrationService/collectionRegistration.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TokensRegistrationModule } from 'src/token-registration-service/token-registration-service.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { BaseEventParams } from '../entities/entities.entity.base-event-params';
import { OrderCancelEvents } from '../entities/events.entity.order-cancel-events';
import { OrderMatchEvents } from '../entities/events.entity.order-match-events';
import { FetchAndSaveMetadataService } from '../handlers/common/fetch-and-save-metadata.handler.common';
import { ERC1155Handler } from '../handlers/erc1155/erc1155.handler';
import { ERC721Handler } from '../handlers/erc721/erc721.handler';
import { OrderMatchHandler } from '../handlers/order/events.order.handler';
import { StoreOnchainBuySellOrders } from '../handlers/utils/events.utils.events.store-buy-sell-orders';
import { OrderCancelEventService } from '../service/events.order-cancel-events.service';
import { OrderMatchEventService } from '../service/events.order-match-events.service';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [
    RpcProviderModule,
    ActivitiesModule,
    CollectionsRegistrationModule,
    TokensRegistrationModule,
    TokensModule,
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
    StoreOnchainBuySellOrders,
    FetchAndSaveMetadataService,
  ],
  exports: [
    SyncEventsService,
    OrderMatchEventService,
    OrderCancelEventService,
    StoreOnchainBuySellOrders,
    FetchAndSaveMetadataService,
  ],
})
export class SyncEventsModule {}
