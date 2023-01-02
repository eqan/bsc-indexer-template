import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderMatchEventService } from 'src/events/service/events.order-match-events.service';
import { OrderMatchEvent } from '../entities/events.entity.order-match-events';
@Module({
  imports: [TypeOrmModule.forFeature([OrderMatchEvent])],
  providers: [OrderMatchEventService],
  exports: [OrderMatchEventService],
})
export class EventsOrderModule {}
