import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('realtime-sync-events')
export class RealtimeSyncProcessor {
  @Process('realtime-sync-job')
  async handleBlocks() {
    console.log()
  }
}
