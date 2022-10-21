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
import { UpdateActivity } from './dto/update-collections.input';
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
              id: rest?.id,
            },
            skip: (page - 1) * limit || 0,
            take: limit || 10,
          }),
          this.activityRepo.count({
            where: {
              id: rest?.id,
            },
          }),
        ]);
        return { items, total };
      } catch (error) {}
    }
  
    /**
     * Get Activity By Id
     * @param continuation
     * @returns Activity against specific id
     */
    async getActivityById(id: string): Promise<Activity> {
      try {
        const activity = this.activityRepo.findOneByOrFail({ id });
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
        await this.activityRepo.delete({ id: In(ids) });
        return null;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    /**
     *  Update Activity
     * @param updateActivity
     * @returns Updated Activity
     */
    async updateActivity(
      updateActivity: UpdateActivity,
    ): Promise<Activity> {
      try {
        const { id, ...rest } = updateActivity;
        await this.activityRepo.update({ id }, rest);
        return await this.getActivityById(id);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  }