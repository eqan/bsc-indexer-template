import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { midwayQueue } from 'src/common/utils.common';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';

@Processor(midwayQueue)
@Injectable()
export class MidwaySyncProcessor {
  constructor(private readonly syncEventsService: SyncEventsService) {}

  private readonly logger = new Logger(midwayQueue);
  QUEUE_NAME = midwayQueue;

  @Process()
  async handleMidwaySync(job: Job) {
    try {
      const fromBlock = job.data.fromBlock;
      const toBlock = job.data.toBlock;
      this.logger.log(
        `Events midway syncing block range [${fromBlock}, ${toBlock}]`,
      );
      await this.syncEventsService.syncEvents(fromBlock, toBlock);
    } catch (error) {
      this.logger.error(`Events Midway syncing failed: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(
      `Queue ${job.id} Failed Processing Midway syncing : ${error}`,
    );
  }
}
