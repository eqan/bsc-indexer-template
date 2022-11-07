import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { getNetworkSettings } from 'src/config/network.config';
import { realtimeQueue } from 'src/common/utils.common';

/**
 * RealtimeSync Job
 * Cron Job to detect new block onchain and activate event syncing offchain
 */
@Injectable()
export class RealtimeSyncService {
  constructor(@InjectQueue(realtimeQueue) private realtimeSyncEvents: Queue) {}
  private readonly logger = new Logger(realtimeQueue);
  networkSettings = getNetworkSettings();

  async syncBlocks() {
    await this.realtimeSyncEvents.add({
      jobId: randomUUID(),
      delay: 3000,
      removeOnComplete: true,
      removeOnFail: true,
      timeout: 60000,
    });
    // console.log(job, 'job created ');
  }

  // Keep up with the head of the blockchain by polling for new blocks every once in a while
  @Cron(`*/24 * * * * *`)
  async handleRealtimeSync() {
    try {
      await this.syncBlocks();
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
