import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import { FilterStatsDto } from './dto/filter-stats.dto';
import { GetAllStats } from './dto/get-all-stats.dto';
import { Stats } from './entities/stats.entity';
import { CollectionsResolver } from 'src/collections/collections.resolver';

@Resolver(() => Stats)
export class StatsResolver {
  constructor(
    private readonly statsService: StatsService,
    private readonly collectionsResolver: CollectionsResolver,
  ) {}

  @Mutation(() => Stats, { name: 'CreateUpdateStats' })
  async create(
    @Args('CreateUpdateStatsInput')
    id: string,
  ): Promise<Stats> {
    try {
      const dayVolume = await this.collectionsResolver.getCollectionVolume(id);
      const floorPrice = await this.collectionsResolver.getCollectionFloorPrice(
        id,
      );
      return await this.statsService.create({ id, floorPrice, dayVolume });
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
