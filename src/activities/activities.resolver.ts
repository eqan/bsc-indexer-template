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
      console.log("Hello world")
      return await this.activitiesService.index(filterDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Activity, { name: 'GetActivityById' })
  async show(@Args('GetActivityByIdInput') id: string): Promise<Activity> {
    try {
      console.log("Hello world")
      return await this.activitiesService.getActivityById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // @Mutation(() => Activity)
  // edit(editDto: Partial<any>): Promise<any> {}

  @Mutation(() => Activity, { nullable: true, name: 'DeleteActivity' })
  async delete(
    @Args({
      name: 'DeleteActivityInput',
    })
    deleteActivityInput: DeleteActivityInput,
  ): Promise<void> {
    try {
      await this.activitiesService.delete(deleteActivityInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
