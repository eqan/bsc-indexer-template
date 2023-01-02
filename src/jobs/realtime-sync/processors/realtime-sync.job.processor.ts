import { ConfigService } from '@nestjs/config';
import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { createChunks } from 'src/common/utils.common';
import { getNetworkSettings } from 'src/config/network.config';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { MidwaySyncService } from 'src/jobs/midway-sync/midway-sync.job.service';
import { RealTimeJobType } from 'src/jobs/types/job.types';
@Processor(QueueType.REALTIME_QUEUE)
@Injectable()
export class RealtimeSyncProcessor {
  constructor(
    private readonly syncEventsService: SyncEventsService,
    private readonly midwaySyncService: MidwaySyncService,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(QueueType.REALTIME_QUEUE);
  redis = new Redis(this.config.get('REDIS_URL'));
  QUEUE_NAME = QueueType.REALTIME_QUEUE;

  @Process()
  async handleSync({ data: { headBlock } }: Job<RealTimeJobType>) {
    try {
      // We allow syncing of up to `maxBlocksLimits` blocks behind the head
      // of the blockchain. If we lag behind more than that, then all
      // previous blocks that we cannot cover here will be divided into chunks
      //to be processed by mid-way-processor
      const maxBlocksLimits = getNetworkSettings().realtimeSyncMaxBlockLag;

      /**
       * base case handle last process block
       * fetch the last synced block
       */
      const lastProcessedBlock = Number(
        (await this.redis.get(`${this.QUEUE_NAME}-last-block`)) || 0,
      );

      const blocksToProcess = headBlock - lastProcessedBlock;
      let fromBlock = lastProcessedBlock;
      let toBlock = headBlock;

      /**
       * BASE Case
       * if lastProcessedBlock is zero add job of the current head Block
       */
      if (lastProcessedBlock === 0) {
        fromBlock = headBlock;
        await this.redis.set(
          `${QueueType.BACKFILL_QUEUE}-last-block`,
          fromBlock,
        );
        await this.syncEventsService.syncEvents(fromBlock, toBlock);
      } else if (blocksToProcess <= maxBlocksLimits) {
        /**
         * execution block for less or equal then 8
         */
        fromBlock = Math.max(
          lastProcessedBlock,
          headBlock - blocksToProcess + 1,
        );
        await this.syncEventsService.syncEvents(fromBlock, toBlock);
      } else {
        /**
         * execution block for greater than 8 divide in chunks and process
         */
        const chunks = createChunks(blocksToProcess);
        for (const chunk of chunks) {
          toBlock = fromBlock + chunk;
          await this.midwaySyncService.syncMidwayBlocks(fromBlock, toBlock);
          fromBlock = toBlock;
        }
      }

      this.logger.log(`Event Sync BlockRange ${fromBlock}-${toBlock}`);
      await this.redis.set(`${this.QUEUE_NAME}-last-block`, headBlock);
    } catch (error) {
      this.logger.error(`Events realtime syncing failed: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    // console.log(job, 'realtime job processor');
    this.logger.error(
      // `Queue ${job.data.jobId} Events realtime syncing : ${error}`,
      `Queue Events realtime syncing : ${error}`,
    );
  }
}
