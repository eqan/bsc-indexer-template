import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderMatchEventService } from 'src/events/service/events.order-match-events.service';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { TokensService } from 'src/tokens/tokens.service';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CollectionsMeta } from './entities/nestedObjects/collections.meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collections, CollectionsMeta]),
    forwardRef(() => TokensModule),
    SyncEventsModule,
  ],
  providers: [CollectionsResolver, CollectionsService, OrderMatchEventService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
