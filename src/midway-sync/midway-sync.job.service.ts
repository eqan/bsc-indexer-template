import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { midwayQueue } from 'src/common/utils.common';

/**
 * MidwaySync Job
 * Job proces chunks of blocks lag behind while processing realtime blocks
 */
@Injectable()
export class MidwaySyncService {
  constructor(@InjectQueue(midwayQueue) private midwaySyncEvents: Queue) {}
  private readonly logger = new Logger(midwayQueue);

  async syncMidwayBlocks(fromBlock: number, toBlock: number) {
    try {
      await this.midwaySyncEvents.add(
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
      this.logger.log('Failed Addind Midway Block Processing Job');
    }
  }
}
