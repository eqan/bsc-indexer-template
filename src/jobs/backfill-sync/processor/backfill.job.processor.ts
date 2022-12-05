import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Job } from 'bull';
import Redis from 'ioredis';
import { getNetworkSettings } from 'src/config/network.config';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { QueueType } from 'src/jobs/enums/jobs.enums';

@Processor(QueueType.BACKFILL_QUEUE)
@Injectable()
export class BackfillSyncProcessor {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly syncEventsService: SyncEventsService,
  ) {}

  QUEUE_NAME = QueueType.BACKFILL_QUEUE;
  private readonly logger = new Logger(this.QUEUE_NAME);
  redis = new Redis();

  @Process()
  async handleBackFillSync() {
    try {
      const maxBlocksLimits = getNetworkSettings().realtimeSyncMaxBlockLag;
      const lastBackfillBlock = Number(
        await this.redis.get(`${this.QUEUE_NAME}-last-block`),
      );
      // console.log('hello last backfilled block', lastBackfillBlock);
      /**
       * if genesis block reached while backfilling stop cron
       */
      if (lastBackfillBlock > 0) {
        const fromBlock = lastBackfillBlock - maxBlocksLimits;
        await this.syncEventsService.syncEvents(fromBlock, lastBackfillBlock);
        this.logger.log(
          `Events Backfill syncing block range [${fromBlock}, ${lastBackfillBlock}]`,
        );
        await this.redis.set(`${this.QUEUE_NAME}-last-block`, fromBlock);
      } else {
        this.logger.log('Events backfill syncing completed till genesis block');
        const job = this.schedulerRegistry.getCronJob(QueueType.BACKFILL_CRON);
        job.stop();
      }
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
