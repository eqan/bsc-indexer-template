import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from 'src/collections/collections.module';
import { OrderMatchEventService } from 'src/events/service/events.order-match-events.service';
import { EventsOrder } from 'src/events/service/events.orders.module';
import { TokensMeta } from './entities/nestedObjects/tokens.meta.entity';
import { Tokens } from './entities/tokens.entity';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    EventsOrder,
    TypeOrmModule.forFeature([Tokens, TokensMeta]),
    forwardRef(() => CollectionsModule),
  ],
  providers: [TokensResolver, TokensService],
  exports: [TokensService],
})
export class TokensModule {}
