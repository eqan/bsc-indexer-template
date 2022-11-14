import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { QueueType } from '../enums/jobs.enums';

/**
 * MidwaySync Job
 * Job proces chunks of blocks lag behind while processing realtime blocks
 */
@Injectable()
export class MidwaySyncService {
  constructor(
    @InjectQueue(QueueType.MIDWAY_QUEUE) private midwaySyncEvents: Queue,
  ) {}
  private readonly logger = new Logger(QueueType.MIDWAY_QUEUE);

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
