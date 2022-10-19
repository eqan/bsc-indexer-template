import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateActivityInput } from './dto/create-activity.input';
import { FilterActivityDto } from './dto/filter.activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';
import { Activity } from './entities/activity.entity';
  
  @Injectable()
  export class ActivityService {
    constructor(
      @InjectRepository(Activity)
      private activityRepo: Repository<Activity>,
    ) {}
  
    /**
     * Create Activity
     * @params createActivityinput
     * @return activity
     */
    async createActivity(createActivityInput: CreateActivityInput): Promise<Activity> {
      try {
        const activity = this.activityRepo.create(createActivityInput);
        return await this.activityRepo.save(activity);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    /**
     * Get /Searched Activity
     * @param filterActivityDto
     * @returns Activity Array or activity against specific parameter
     */
    async findAllActivity(filterActivityDto: FilterActivityDto): Promise<GetAllActivities> {
      try {
        const { page, limit, ...rest } = filterActivityDto;
        const [items, total] = await Promise.all([
          this.activityRepo.find({
            where: {
              cursor: rest?.cursor,
              continuation: rest?.continuation,
            },
            skip: (page - 1) * limit || 0,
            take: limit || 10,
          }),
          this.activityRepo.count({
            where: {
              continuation: rest.continuation,
            },
          }),
        ]);
        return { items, total };
      } catch (error) {}
    }
  
    /**
     * Get Activity By Id
     * @param cursor
     * @returns Activity against specific id
     */
    async getActivityById(cursor: string): Promise<Activity> {
      try {
        const activity = this.activityRepo.findOneByOrFail({ cursor });
        if (!activity) {
          throw new NotFoundException('No Activity Found');
        }
        return activity;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    /**
     * Delete Activity from DB
     * @param deletewithIds
     * @returns vpoid
     */
    async deleteActivity(deletewithIds: { id: string[] }): Promise<void> {
      try {
        const ids = deletewithIds.id;
        await this.activityRepo.delete({ cursor: In(ids) });
        return null;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    // /**
    //  *  Update Activity status
    //  * @param updateActivityStatus
    //  * @returns Updated Activity status
    //  */
    // async updateActivityStatus(
    //   updateActivityStatus: UpdateActivityStatus,
    // ): Promise<Activity> {
    //   try {
    //     const { activityId, ...rest } = updateActivityStatus;
    //     await this.activityRepo.update({ activityId }, rest);
    //     return this.getActivityById(activityId);
    //   } catch (error) {
    //     throw new BadRequestException(error);
    //   }
    // }
  }