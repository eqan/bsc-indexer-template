import { Module } from '@nestjs/common';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [CollectionsJobModule],
  providers: [SyncEventsService],
  exports: [SyncEventsService],
})
export class SyncEventsModule {}
