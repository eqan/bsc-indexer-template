import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import { FilterStatsDto } from './dto/filter-stats.dto';
import { GetAllStats } from './dto/get-all-stats.dto';
import { Stats } from './entities/stats.entity';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronType } from 'src/jobs/types/cron.types';
import { QueueType } from 'src/jobs/enums/jobs.enums';

@Resolver(() => Stats)
export class StatsResolver {
  constructor(
    private readonly statsService: StatsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  CRON_NAME = QueueType.STATS_CRON;

  @Mutation(() => Stats, { name: 'CreateUpdateStats', nullable: true })
  @Timeout(5000)
  async create(): Promise<void> {
    try {
      this.statsService.fetchDataAndCreate();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => CronType, { name: 'StopStatsCron', nullable: true })
  async StopStatsCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).stop();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => CronType, { name: 'StartStatsCron', nullable: true })
  async startStatsCron(): Promise<CronType> {
    try {
      this.schedulerRegistry.getCronJob(this.CRON_NAME).start();
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  /**
   * GET All Stats
   * @returns Stats Array and their total count
   */
  @Query(() => GetAllStats, { name: 'GetAllStats' })
  async index(
    @Args('GetAllStatsInput', { nullable: true, defaultValue: {} })
    filterDto: FilterStatsDto,
  ): Promise<GetAllStats> {
    try {
      return await this.statsService.index(filterDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Stats by Id
   * @returns Stats Data such as Collection Day Volume, Average Price, Unique Owners, and Floor Price
   */
  @Query(() => Stats, { name: 'GetStatsById' })
  async show(@Args('GetStatsByIdInput') id: string): Promise<Stats> {
    try {
      const data = await this.statsService.show(id);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
