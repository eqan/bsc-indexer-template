import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CollectionsMeta } from './entities/nestedObjects/collections.meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collections, CollectionsMeta]),
    forwardRef(() => TokensModule),
    // SyncEventsModule,
    OrdersModule,
  ],
  // providers: [CollectionsResolver, CollectionsService, OrderMatchEventService],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
