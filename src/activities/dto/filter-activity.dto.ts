import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ActivityType } from '../entities/enums/activity.type.enum';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterActivityDto extends PaginationParam {
  @Field({ nullable: true })
  activityId?: string;

  @IsEnum(ActivityType)
  @Field(() => ActivityType, { nullable: true })
  type: ActivityType;
}
