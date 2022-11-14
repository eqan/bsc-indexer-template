import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { Activity } from './entities/activity.entity';
// import { CreateActivityTransferInput } from './dto/create-activity.transfer.input';
import { BadRequestException } from '@nestjs/common';
// import { CreateActivityMintInput } from './dto/create-activity.mint.input';
import { DeleteActivityInput } from './dto/delete-activity.input.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {
    // super();
  }

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

  @Query(() => [Activity], { name: 'GetAllActivities' })
  async index(
    @Args('GetAllActivities')
    filterDto: FilterActivityDto,
  ): Promise<GetAllActivities> {
    try {
      let data = await this.activitiesService.index(filterDto);
      console.log(data.items);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Activity, { name: 'GetActivityById' })
  async show(@Args('GetActivityByIdInput') id: string): Promise<Activity> {
    try {
      const data = await this.activitiesService.getActivityById(id);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Collection
   * @param collectionId
   * @returns Nothing
   */
  @Query(() => Activity, { name: 'DeleteActivity', nullable: true })
  async delete(
    @Args('deleteActivityInput') deleteActivityInput: DeleteActivityInput,
  ): Promise<void> {
    try {
      console.log(deleteActivityInput, 'deleteActivityInput');
      await this.activitiesService.delete(deleteActivityInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
