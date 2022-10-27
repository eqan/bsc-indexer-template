import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import BaseProvider from 'src/core/base.BaseProvider';
// import { CreateActivityTransferInput } from './dto/create-activity.transfer.input';
import { BadRequestException } from '@nestjs/common';
import { ActivityTransfer } from './entities/activity.transfer.entity';
// import { CreateActivityMintInput } from './dto/create-activity.mint.input';
import { ActivityMint } from './entities/activity.mint.entity';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { GetAllActivities } from './dto/get-all-activities.dto';
import { DeleteActivityInput } from './dto/delete-activity.input.dto';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {
    // super();
  }

  @Mutation(() => Activity)
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
      return await this.activitiesService.index(filterDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Activity, { name: 'GetActivityById' })
  async show(@Args('GetActivityById') activityId: string): Promise<Activity[]> {
    try {
      return await this.activitiesService.show(activityId);
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
