import { Module } from '@nestjs/common';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [CollectionsJobModule, RpcProviderModule],
  providers: [SyncEventsService],
  exports: [SyncEventsService],
})
export class SyncEventsModule {}
