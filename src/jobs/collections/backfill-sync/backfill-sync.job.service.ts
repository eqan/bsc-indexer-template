import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { backfillQueue } from 'src/common/utils.common';

/**
 * BackfillSync Job
 * to backfilling the events from localBlock up to genesis
 */
@Injectable()
export class BackfillSyncService {
  constructor(@InjectQueue(backfillQueue) private backfillSyncEvents: Queue) {}
  private readonly logger = new Logger(backfillQueue);

  async syncBackFillBlocks(fromBlock: number, toBlock: number) {
    try {
      await this.backfillSyncEvents.add(
        { fromBlock, toBlock },
        {
          jobId: randomUUID(),
          delay: 3000,
          removeOnComplete: true,
          removeOnFail: true,
          timeout: 60000,
        },
      );
    } catch (error) {
      this.logger.log('Failed BackFilling Block Processing Job');
    }
  }
}
