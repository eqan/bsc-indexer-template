import Redis from 'ioredis';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Queue } from 'bull';
import { CronJob } from 'cron';
import { randomUUID } from 'crypto';
import { QueueType } from '../enums/jobs.enums';
import { getNetworkSettings } from 'src/config/network.config';

/**
 * BackfillSync Job
 * to backfill the events back from the first RealTimeBlock Processed upto the genesis block
 */

@Injectable()
export class BackfillSyncService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectQueue(QueueType.BACKFILL_QUEUE) private backfillSyncEvents: Queue,
  ) {}
  private readonly redis = new Redis();

  private readonly logger = new Logger(QueueType.BACKFILL_QUEUE);
  private readonly seconds = '*/5';
  CRON_NAME = QueueType.BACKFILL_CRON;

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

  //starting back-fill cron after 24sec so that real-time cron executes first
  @Timeout(getNetworkSettings().backfillSyncTimeout)
  addBackFillCron() {
    const job = new CronJob(`${this.seconds} * * * * *`, async () => {
      try {
        const eventFromRunTheBackFill = await this.redis.get(
          `${QueueType.BACKFILL_QUEUE}-last-block`,
        );

        if (eventFromRunTheBackFill) {
          await this.syncBackFillBlocks();
        }
      } catch (error) {
        this.logger.error(
          'events-sync-catchup-backfill',
          `Failed to catch up events: ${error}`,
        );
      }
      // this.logger.warn(
      //   `Backfill time (${this.seconds}) for job ${this.CRON_NAME} to run!`,
      // );
    });

    this.schedulerRegistry.addCronJob(this.CRON_NAME, job);
    job.start();
  }
}
