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
      // console.log(createActivityInput.type);
      // let createActivity:any = null

      // if(createActivityInput.type=== ActivityType.MINT){
      //   createActivity ={ ...createActivityInput.createBidActivityInput}
      // }
      // console.log(createActivity)
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
            activityId: rest?.activityId,
            type: rest?.type,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.activityRepo.count({
          where: {
            activityId: rest?.activityId,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async show(activityId: string): Promise<Activity[]> {
    try {
      const found = await this.activityRepo.findBy({
        activityId,
      });
      if (!found) {
        throw new NotFoundException(`Activity against ${activityId} not found`);
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
