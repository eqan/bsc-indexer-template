import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { QueueType } from '../enums/jobs.enums';
import { BackfillSyncService } from './backfill-sync.job.service';
import { BackfillSyncProcessor } from './processor/backfill.job.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.BACKFILL_QUEUE }),
    SyncEventsModule,
  ],
  providers: [BackfillSyncService, BackfillSyncProcessor],
  exports: [BackfillSyncService],
})
export class BackfillSyncModule {}
