import { Module } from '@nestjs/common';
import { RealtimeSyncService } from './realtime-sync.service';

@Module({
  providers: [RealtimeSyncService],
})
export class RealtimeSyncModule {}
