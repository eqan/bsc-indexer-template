import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { midwayQueue } from 'src/common/utils.common';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { MidWayJobType } from 'src/jobs/types/job.types';

@Processor(midwayQueue)
@Injectable()
export class MidwaySyncProcessor {
  constructor(private readonly syncEventsService: SyncEventsService) {}

  private readonly logger = new Logger(midwayQueue);
  QUEUE_NAME = midwayQueue;

  @Process()
  async handleMidwaySync({ data: { fromBlock, toBlock } }: Job<MidWayJobType>) {
    try {
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
