import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RealtimeSyncProcessor } from './realtime-sync.processor';
import { RealtimeSyncService } from './realtime-sync.service';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'realtime-sync-events' })],
  providers: [RealtimeSyncService, RealtimeSyncProcessor, RpcProviderModule],
})
export class RealtimeSyncModule {}
