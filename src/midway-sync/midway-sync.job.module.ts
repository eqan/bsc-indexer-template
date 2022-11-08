import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { midwayQueue } from 'src/common/utils.common';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { MidwaySyncService } from './midway-sync.job.service';
import { MidwaySyncProcessor } from './processor/midway-sync.job.processor';

@Module({
  imports: [BullModule.registerQueue({ name: midwayQueue }), SyncEventsModule],
  providers: [MidwaySyncService, MidwaySyncProcessor],
  exports: [MidwaySyncService],
})
export class MidwaySyncModule {}
