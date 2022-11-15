import { SchedulerRegistry } from '@nestjs/schedule';
import { CronType } from '../types/cron.types';
import { Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { QueueType } from '../enums/jobs.enums';

@Resolver()
export class BackFillJobResolver {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  CRON_NAME = QueueType.BACKFILL_CRON;

  @Mutation(() => CronType, { name: 'StopBackFillCron', nullable: true })
  async StopBackFillCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).stop();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => CronType, { name: 'StartBackFillCron', nullable: true })
  async startBackFillCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).start();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
