import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { QueueType } from '../enums/jobs.enums';
import { MidwaySyncService } from './midway-sync.job.service';
import { MidwaySyncProcessor } from './processor/midway-sync.job.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.MIDWAY_QUEUE }),
    SyncEventsModule,
  ],
  providers: [MidwaySyncService, MidwaySyncProcessor],
  exports: [MidwaySyncService],
})
export class MidwaySyncModule {}
