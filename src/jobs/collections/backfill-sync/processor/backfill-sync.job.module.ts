import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { backfillQueue } from 'src/common/utils.common';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { BackfillSyncService } from '../backfill-sync.job.service';
import { BackfillSyncProcessor } from '../backfill.job.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: backfillQueue }),
    SyncEventsModule,
  ],
  providers: [BackfillSyncService, BackfillSyncProcessor],
})
export class BackfillSyncModule {}
