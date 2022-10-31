import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';

/**
 * RealtimeSync Job
 * Cron Job to detect new block onchain and activate event syncing offchain
 */
@Injectable()
export class RealtimeSyncService {
  constructor(private rpcProvider: RpcProvider) {
    const handleRealtimeSync = () => {
      // Keep up with the head of the blockchain by polling for new blocks every once in a while
      this.rpcProvider.safeWebSocketSubscription(async (provider) => {
        provider.on('block', async (block) => {
          this.logger.log('events-sync-catchup', `Detected new block ${block}`);

          try {
            //   await realtimeEventsSync.addToQueue();
            console.log('Hello from RealTime Sync');
          } catch (error) {
            this.logger.error(
              'events-sync-catchup',
              `Failed to catch up events: ${error}`,
            );
          }
        });
      });
      this.logger.log('Called when the current second is 45');
    };
    handleRealtimeSync();
  }
  private readonly logger = new Logger(RealtimeSyncService.name);

  // @Cron('10 * * * * *')
}
