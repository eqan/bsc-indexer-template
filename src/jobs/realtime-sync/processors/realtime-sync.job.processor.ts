import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { realtimeQueue } from 'src/common/utils.common';
import { getNetworkSettings } from 'src/config/network.config';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';

@Processor(realtimeQueue)
export class RealtimeSyncProcessor {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly syncEventsService: SyncEventsService,
  ) {}
  private readonly logger = new Logger(realtimeQueue);
  redis = new Redis();
  QUEUE_NAME = realtimeQueue;

  @Process()
  async handleSync() {
    try {
      // We allow syncing of up to `maxBlocks` blocks behind the head
      // of the blockchain. If we lag behind more than that, then all
      // previous blocks that we cannot cover here will be relayed to
      // the backfill queue.
      const maxBlocks = getNetworkSettings().realtimeSyncMaxBlockLag;

      const headBlock = await this.rpcProvider.baseProvider.getBlockNumber();

      // Fetch the last synced blocked
      let localBlock = Number(
        await this.redis.get(`${this.QUEUE_NAME}-last-block`),
      );
      if (localBlock >= headBlock) {
        // Nothing to sync
        return;
      }

      if (localBlock === 0) {
        localBlock = headBlock;
      } else {
        localBlock++;
      }

      const fromBlock = Math.max(localBlock, headBlock - maxBlocks + 1);
      this.logger.log(
        `Events realtime syncing block range [${fromBlock}, ${headBlock}]`,
      );

      await this.syncEventsService.syncEvents(fromBlock, headBlock);

      // Send any remaining blocks to the backfill queue
      if (localBlock < fromBlock) {
        this.logger.log(
          `Out of sync: local block ${localBlock} and upstream block ${fromBlock}`,
        );
        // await eventsSyncBackfill.addToQueue(localBlock, fromBlock - 1);
      }

      // To avoid missing any events, save the last synced block with a delay
      // in order to ensure that the latest blocks will get queried more than
      // once, which is exactly what we are looking for (since events for the
      // latest blocks might be missing due to upstream chain reorgs):
      // https://ethereum.stackexchange.com/questions/109660/eth-getlogs-and-some-missing-logs

      await this.redis.set(`${this.QUEUE_NAME}-last-block`, headBlock - 5);
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
