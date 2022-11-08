import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { backfillQueue } from 'src/common/utils.common';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';

@Processor(backfillQueue)
@Injectable()
export class BackfillSyncProcessor {
  constructor(private readonly syncEventsService: SyncEventsService) {}

  private readonly logger = new Logger(backfillQueue);
  QUEUE_NAME = backfillQueue;

  @Process()
  async handleMidwaySync(job: Job) {
    try {
      const fromBlock = job.data.fromBlock;
      const toBlock = job.data.toBlock;
      this.logger.log(
        `Events Backfill syncing block range [${fromBlock}, ${toBlock}]`,
      );
      await this.syncEventsService.syncEvents(fromBlock, toBlock);
    } catch (error) {
      this.logger.error(`Events backfill syncing failed: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(
      `Queue ${job.id} Failed Processing Backfill syncing : ${error}`,
    );
  }
}
