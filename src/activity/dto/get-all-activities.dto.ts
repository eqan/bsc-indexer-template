import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Activity } from '../entities/activity.entity';

@ObjectType("GetAllActivities")
export class GetAllActivities {
  @Field(() => [Activity])
  items: Activity[];

  @Field(() => Int)
  total: number;
}