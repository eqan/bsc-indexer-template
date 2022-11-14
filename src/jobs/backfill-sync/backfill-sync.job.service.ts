import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bull';
import { CronJob } from 'cron';
import { randomUUID } from 'crypto';
import { QueueType } from '../enums/jobs.enums';

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
  private readonly logger = new Logger(QueueType.BACKFILL_QUEUE);
  private readonly seconds = 10;
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

  addBackFillCron() {
    const job = new CronJob(`${this.seconds} * * * * *`, async () => {
      try {
        await this.syncBackFillBlocks();
      } catch (error) {
        this.logger.error(
          'events-sync-catchup-backfill',
          `Failed to catch up events: ${error}`,
        );
      }
      // this.logger.warn(
      //   `time (${this.seconds}) for job ${this.CRON_NAME} to run!`,
      // );
    });

    this.schedulerRegistry.addCronJob(this.CRON_NAME, job);
    job.start();
  }

  //   @Cron(`*/10 * * * * *`, { name: QueueType.BACKFILL_CRON })
  // async handleBackfill() {
  //   try {
  //     await this.syncBackFillBlocks();
  //   } catch (error) {
  //     this.logger.error(
  //       'events-sync-catchup-backfill',
  //       `Failed to catch up events: ${error}`,
  //     );
  //   }
  // }
}
