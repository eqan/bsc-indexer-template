import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateStatsInput } from './dto/create-stats.input';
import { FilterStatsDto } from './dto/filter-stats.dto';
import { GetAllStats } from './dto/get-all-stats.dto';
import { Stats } from './entities/stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private statsRepo: Repository<Stats>,
  ) {}

  /**
   * Create Stats in DB
   * @params CreateStatsInput
   * @returns Created Stats
   */
  async create(createStatsInput: CreateStatsInput): Promise<Stats> {
    try {
      const stats = this.statsRepo.create(createStatsInput);
      return await this.statsRepo.save(stats);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async index(filterStats: FilterStatsDto): Promise<GetAllStats> {
    try {
      const { page = 1, limit = 20, ...rest } = filterStats;
      const [items, total] = await Promise.all([
        this.statsRepo.find({
          where: {
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.statsRepo.count({
          where: {
            id: rest?.id,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET Stats By Id
   * @param id
   * @returns Stats against Provided Id
   */
  async show(id: string): Promise<Stats> {
    try {
      const found = await this.statsRepo.findOneBy({
        id,
      });
      if (!found) {
        throw new NotFoundException(`Stats against ${id} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Edit Stats
   * @param statsId
   * @returns Updated Stats
   */
  edit(id: number) {
    return `This action updates a #${id} stats`;
  }

  /**
   * DEETE Stats
   * @param statsIds
   * @returns
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      const values = await this.statsRepo.delete({ id: In(ids) });
      if (!values) {
        throw new NotFoundException('Stats not found');
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
