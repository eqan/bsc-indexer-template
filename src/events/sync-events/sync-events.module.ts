import { Module } from '@nestjs/common';
import { ActivitiesModule } from 'src/activities/activities.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [CollectionsJobModule, RpcProviderModule, ActivitiesModule],
  providers: [SyncEventsService],
  exports: [SyncEventsService],
})
export class SyncEventsModule {}
