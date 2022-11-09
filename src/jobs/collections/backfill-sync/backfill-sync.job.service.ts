import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { backfillQueue } from 'src/common/utils.common';
import { Cron } from '@nestjs/schedule';

/**
 * BackfillSync Job
 * to backfill the events back from the first RealTimeBlock Processed upto the genesis block
 */
@Injectable()
export class BackfillSyncService {
  constructor(@InjectQueue(backfillQueue) private backfillSyncEvents: Queue) {}
  private readonly logger = new Logger(backfillQueue);

  async syncBackFillBlocks() {
    try {
      await this.backfillSyncEvents.add({
        jobId: randomUUID(),
        delay: 3000,
        removeOnComplete: true,
        removeOnFail: true,
        timeout: 60000,
      });
    } catch (error) {
      this.logger.log('Failed Adding BackFill Block Processing Job');
    }
  }
  @Cron(`*/10 * * * * *`)
  async handleBackfill() {
    try {
      await this.syncBackFillBlocks();
    } catch (error) {
      this.logger.error(
        'events-sync-catchup-backfill',
        `Failed to catch up events: ${error}`,
      );
    }
  }
}
