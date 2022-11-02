import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RealtimeSyncProcessor } from './processors/realtime-sync.job.processor';
import { RealtimeSyncService } from './realtime-sync.job.service';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { realtimeQueue } from 'src/common/utils.common';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: realtimeQueue }),
    SyncEventsModule,
  ],
  providers: [RealtimeSyncService, RealtimeSyncProcessor, RpcProviderModule],
})
export class RealtimeSyncModule {}
