import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { ActivityService } from './activity.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { DeleteActivityInput } from './dto/delete-activity.input';
import { FilterActivityDto } from './dto/filter.activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';
import { UpdateActivity } from './dto/update-collections.input';
import { Activity } from './entities/activity.entity';

@Resolver(() => Activity)
export class ActivityResolver extends BaseProvider<Activity | FilterActivityDto> {
  constructor(private readonly activityService: ActivityService) {
    super();
  }


  /**
   * Create Activity
   * @param createActivityInput 
   * @returns Activity
   */
  @Mutation(() => Activity, { name: 'CreateActivity' })
  async create(
    @Args('CreateActivityInput') createActivityInput: CreateActivityInput,
  ): Promise<Activity> {
    try {
      return await this.activityService.createActivity(createActivityInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Activity
   * @param deleteActivityInput 
   * @returns void
   */
  @Mutation(() => Activity, { name: 'DeleteActivity' })
  async delete(
    @Args('DeleteActivityInput') deleteActivityInput: DeleteActivityInput,
  ): Promise<void> {
    try {
      return await this.activityService.deleteActivity(deleteActivityInput);
    } catch (error) {}
  }

  /**
   * Update Activity Status
   * @param updateActivity
   * @returns Updated Activity
   */
  @Mutation(() => Activity, { name: 'UpdateActivityAttribute' })
  async edit(
    @Args('UpdateActivityInput')
    updateActivity: UpdateActivity,
  ): Promise<Activity> {
    try {
      updateActivity['lastUpdatedAt'] = new Date();
      return await this.activityService.updateActivity(updateActivity);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Activity By Id
   * @param activityId 
   * @returns Activity against specific id
   */
  @Query(() => Activity, { name: 'GetActivityById' })
  async show(@Args('activityId') activityId: string): Promise<Activity> {
    try {
      return await this.activityService.getActivityById(activityId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  /**
   * Get ALl Activity
   * @param filterActivityDto 
   * @returns Searched or all activity
   */
  @Query(() => GetAllActivities, { name: 'GetAllActivities' })
  async index(
    @Args('GetAllActivities') filterActivityDto: FilterActivityDto,
  ): Promise<GetAllActivities> {
    try {
      return await this.activityService.findAllActivity(filterActivityDto);
    } catch (error) {}
  }
}