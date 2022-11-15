import { SchedulerRegistry } from '@nestjs/schedule';
import { CronType } from '../types/cron.types';
import { Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { QueueType } from '../enums/jobs.enums';

@Resolver()
export class RealTimeJobResolver {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  CRON_NAME = QueueType.REAL_TIME_CRON;

  @Mutation(() => CronType, { name: 'StopRealTimeCron', nullable: true })
  async StopRealTimeCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).stop();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => CronType, { name: 'StartRealTimeCron', nullable: true })
  async startRealTimeCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).start();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
