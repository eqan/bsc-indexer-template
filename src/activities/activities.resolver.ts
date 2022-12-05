import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { Activity } from './entities/activity.entity';
import { BadRequestException } from '@nestjs/common';
import { DeleteActivityInput } from './dto/delete-activity.input.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation(() => Activity, { name: 'CreateActivity' })
  async create(
    @Args('CreateActivityInput')
    createActivityInput: CreateActivityInput,
  ): Promise<Activity> {
    try {
      return await this.activitiesService.create(createActivityInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET All Activities
   * @returns Activities Array and their total count
   */
  @Query(() => GetAllActivities, { name: 'GetAllActivities' })
  async index(
    @Args('GetAllActivitiesInput', { nullable: true, defaultValue: {} })
    filterDto: FilterActivityDto,
  ): Promise<GetAllActivities> {
    try {
      return await this.activitiesService.index(filterDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Activity, { name: 'GetActivityById' })
  async show(@Args('GetActivityByIdInput') id: string): Promise<Activity> {
    try {
      const data = await this.activitiesService.show(id);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Activity
   * @param activityId
   * @returns Nothing
   */
  @Mutation(() => Activity, { name: 'DeleteActivity', nullable: true })
  async delete(
    @Args({ name: 'DeleteActivityInput' })
    deleteActivityInput: DeleteActivityInput,
  ): Promise<void> {
    try {
      console.log(deleteActivityInput, 'deleteActivityInput');
      await this.activitiesService.delete(deleteActivityInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
