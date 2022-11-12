import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityInput } from './dto/create-activity.input';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';
import { UpdateActivityInput } from './dto/update-activity.input';
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
      console.log(createActivityInput)
      const activity = this.activityRepo.create(createActivityInput);
      return await this.activityRepo.save(activity);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Activities
   * @param filterActivity
   * @returns All Activities
   */
  async index(filterActivity: FilterActivityDto): Promise<GetAllActivities> {
    try {
      const { page, limit, ...rest } = filterActivity;
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
   * @returns Token against Provided Id
   */
  async getActivityById(id: string): Promise<Activity> {
    try {
      console.log("Hello world")
      const found = await this.activityRepo.findOneBy({
        id,
      });
      if (!found) {
        throw new NotFoundException(`Activity against ${id} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async show(id: string): Promise<Activity[]> {
    try {
      const found = await this.activityRepo.findBy({
        id: id,
      });
      if (!found) {
        throw new NotFoundException(`Activity against ${id} not found`);
      }
      return found;
    } catch (error) {}
  }

  edit(id: number, updateActivityInput: UpdateActivityInput) {
    return `This action updates a #${id} activity`;
  }

  /**
   * DEETE Token
   * @param tokenIds
   * @returns
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      const values = await this.activityRepo.delete(ids);
      if (!values) {
        throw new NotFoundException('Token not found');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
