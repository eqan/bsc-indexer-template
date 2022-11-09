import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { backfillQueue } from 'src/common/utils.common';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { getNetworkSettings } from 'src/config/network.config';

@Processor(backfillQueue)
@Injectable()
export class BackfillSyncProcessor {
  constructor(
    private readonly syncEventsService: SyncEventsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(backfillQueue);
  QUEUE_NAME = backfillQueue;
  redis = new Redis();

  @Process()
  async handleMidwaySync() {
    try {
      const maxBlocks = getNetworkSettings().realtimeSyncMaxBlockLag;
      const lastBackfillBlock = Number(
        await this.redis.get(`${this.QUEUE_NAME}-last-block`),
      );
      if (lastBackfillBlock) {
        const fromBlock = lastBackfillBlock - maxBlocks;
        await this.syncEventsService.syncEvents(fromBlock, lastBackfillBlock);
        this.logger.log(
          `Events Backfill syncing block range [${fromBlock}, ${lastBackfillBlock}]`,
        );
        await this.redis.set(`${this.QUEUE_NAME}-last-block`, fromBlock);
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
