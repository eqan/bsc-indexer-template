import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderMatchEvent } from 'src/events/entities/events.entity.order-match-events';
import { EventsOrderModule } from 'src/events/service/events.orders.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CollectionsMeta } from './entities/nestedObjects/collections.meta.entity';

@Module({
  imports: [
    EventsOrderModule,
    TokensModule,
    TypeOrmModule.forFeature([Collections, CollectionsMeta, OrderMatchEvent]),
    forwardRef(() => TokensModule),
  ],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsResolver, CollectionsService],
})
export class CollectionsModule {}
