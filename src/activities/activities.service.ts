import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemErrors } from 'src/constants/errors.enum';
import { In, Repository } from 'typeorm';
import { CreateActivityInput } from './dto/create-activity.input';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  /**
   * Create Activity in DB
   * @params CreateActivityInput
   * @returns Created Activity
   */
  async create(createActivityInput: CreateActivityInput): Promise<Activity> {
    try {
      const activity = this.activityRepo.create(createActivityInput);
      return await this.activityRepo.save(activity);
    } catch (error) {
      throw new BadRequestException(SystemErrors.CREATE_ACTIVITY);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async index(filterActivity: FilterActivityDto): Promise<GetAllActivities> {
    try {
      const { page = 1, limit = 20, ...rest } = filterActivity;
      const [items, total] = await Promise.all([
        this.activityRepo.find({
          where: {
            id: rest?.id,
            type: rest?.type,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.activityRepo.count({
          where: {
            id: rest.id,
            type: rest?.type,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET Activity By Id
   * @param id
   * @returns Activity against Provided Id
   */
  async show(id: string): Promise<Activity> {
    try {
      const found = await this.activityRepo.findOneBy({
        id,
      });
      if (!found) {
        throw new NotFoundException(`Activity against ${id} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(SystemErrors.FIND_ACTIVITY);
    }
  }

  /**
   * Edit Activity
   * @param activityId
   * @returns Updated Activity
   */
  edit(id: number) {
    return `This action updates a #${id} activity`;
  }

  /**
   * DEETE Activity
   * @param activityIds
   * @returns
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      const values = await this.activityRepo.delete({ id: In(ids) });
      if (!values) {
        throw new NotFoundException('Activity not found');
      }
      return null;
    } catch (error) {
      throw new BadRequestException(SystemErrors.DELETE_ACTIVITY);
    }
  }
}
