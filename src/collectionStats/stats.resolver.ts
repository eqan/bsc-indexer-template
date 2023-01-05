import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import { FilterStatsDto } from './dto/filter-stats.dto';
import { GetAllStats } from './dto/get-all-stats.dto';
import { Stats } from './entities/stats.entity';
import { CollectionsResolver } from 'src/collections/collections.resolver';
import { Cron } from '@nestjs/schedule';

@Resolver(() => Stats)
export class StatsResolver {
  constructor(
    private readonly statsService: StatsService,
    private readonly collectionsResolver: CollectionsResolver,
  ) {}

  @Mutation(() => Stats, { name: 'CreateUpdateStats', nullable: true })
  @Cron('0 0 * * *')
  private async create(): Promise<void> {
    const { items } = await this.collectionsResolver.index({
      page: 0,
      limit: 0,
    });
    items.map(async (item) => {
      const id = item.id;
      const floorPrice = await this.collectionsResolver.getCollectionFloorPrice(
        id,
      );
      const dayVolume = await this.collectionsResolver.getCollectionVolume(id);
      return await this.statsService.create({ id, floorPrice, dayVolume });
    });
    // results = await Promise.all(results);
    // console.log(results);
    // results.map((result) => {
    //   try {
    //     finalResults.push(this.statsService.create(result));
    //   } catch (error) {
    //     throw new BadRequestException(error);
    //   }
    // });
    // finalResults = await Promise.all(finalResults);
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
   * @returns Stats Data such as Collection Day Volume, and Floor Price
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
