import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { MidwaySyncModule } from 'src/jobs/midway-sync/midway-sync.job.module';
import { BackfillSyncModule } from '../backfill-sync/backfill-sync.job.module';
import { QueueType } from '../enums/jobs.enums';
import { RealTimeJobResolver } from '../resolvers/realtime.job.resolver';
import { RealtimeSyncProcessor } from './processors/realtime-sync.job.processor';
import { RealtimeSyncCronService } from './realtime-sync-cron.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.REALTIME_QUEUE }),
    SyncEventsModule,
    MidwaySyncModule,
    BackfillSyncModule,
  ],
  providers: [
    RealtimeSyncProcessor,
    RealTimeJobResolver,
    RealtimeSyncCronService,
    RpcProviderModule,
  ],
})
export class RealtimeSyncModule {}
