import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { getNetworkSettings } from 'src/config/network.config';
import { QueueType } from '../enums/jobs.enums';
import { RpcProvider } from './../../common/rpc-provider/rpc-provider.common';

/**
 * RealtimeSync Job
 * Cron Job to detect new block onchain and activate event syncing offchain
 */
@Injectable()
export class RealtimeSyncCronService {
  constructor(
    @InjectQueue(QueueType.REALTIME_QUEUE) private realtimeSyncEvents: Queue,
    private readonly rpcProvider: RpcProvider,
  ) {}
  private readonly logger = new Logger(QueueType.REALTIME_QUEUE);
  networkSettings = getNetworkSettings();

  async syncRealTimeBlocks(headBlock: number) {
    await this.realtimeSyncEvents.add(
      {
        headBlock,
      },
      {
        jobId: randomUUID(),
        delay: 3000,
        removeOnComplete: true,
        removeOnFail: true,
        timeout: 60000,
      },
    );
  }

  // Keep up with the head of the blockchain by polling for new blocks every once in a while
  @Cron(`*/24 * * * * *`, { name: QueueType.REAL_TIME_CRON })
  async handleRealtimeSync() {
    try {
      const headBlock = await this.rpcProvider.baseProvider.getBlockNumber();
      await this.syncRealTimeBlocks(headBlock);
    } catch (error) {
      this.logger.error(
        'events-sync-catchup',
        `Failed to catch up events: ${error}`,
      );
    }
  }
}

// websocket subscription to listening for onchain block events
// this.rpcProvider.safeWebSocketSubscription(async (provider) => {
//   provider.on('block', async (block) => {
//     this.logger.log('events-sync-catchup', `Detected new block ${block}`);
//     try {
//       //   await realtimeEventsSync.addToQueue();
//       console.log('Hello from RealTime Sync');
//     } catch (error) {
//       this.logger.error(
//         'events-sync-catchup',
//         `Failed to catch up events: ${error}`,
//       );
//     }
//   });
// });
// this.logger.log('Called when the current second is 45');
