import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { createChunks } from 'src/common/utils.common';
import { getNetworkSettings } from 'src/config/network.config';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { BackfillSyncService } from 'src/jobs/backfill-sync/backfill-sync.cron.service';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { MidwaySyncService } from 'src/jobs/midway-sync/midway-sync.job.service';
import { RealTimeJobType } from 'src/jobs/types/job.types';
@Processor(QueueType.REALTIME_QUEUE)
@Injectable()
export class RealtimeSyncProcessor {
  constructor(
    private readonly syncEventsService: SyncEventsService,
    private readonly midwaySyncService: MidwaySyncService,
    private readonly backfillSyncService: BackfillSyncService,
  ) {}

  private readonly logger = new Logger(QueueType.REALTIME_QUEUE);
  redis = new Redis();
  QUEUE_NAME = QueueType.REALTIME_QUEUE;

  @Process()
  async handleSync({ data: { headBlock } }: Job<RealTimeJobType>) {
    try {
      // We allow syncing of up to `maxBlocks` blocks behind the head
      // of the blockchain. If we lag behind more than that, then all
      // previous blocks that we cannot cover here will be divided into chunks
      //to be processed by mid-way-processor
      const maxBlocks = getNetworkSettings().realtimeSyncMaxBlockLag;

      // Fetch the last synced block
      const localBlock = Number(
        (await this.redis.get(`${this.QUEUE_NAME}-last-block`)) || 0,
      );
      const blocksToProcess = headBlock - localBlock;
      let fromBlock = localBlock;
      let toBlock = headBlock;

      // Nothing to sync
      if (localBlock >= headBlock) return;
      // console.log(localBlock, 'realtime-local');

      //if localBlock is zero add job of the current head Block
      if (localBlock === 0) {
        fromBlock = headBlock;
        await this.redis.set(
          `${QueueType.BACKFILL_QUEUE}-last-block`,
          fromBlock,
        );
        this.backfillSyncService.addBackFillCron();
        await this.syncEventsService.syncEvents(fromBlock, toBlock);
        //if blocks to process are 8 or less
      } else if (blocksToProcess <= maxBlocks) {
        fromBlock = Math.max(localBlock, headBlock - blocksToProcess + 1);
        await this.syncEventsService.syncEvents(fromBlock, toBlock);
      } else {
        //if greater than 8 divide in chunks then process
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
    this.logger.error(`Queue ${job.id} Events realtime syncing : ${error}`);
  }
}
