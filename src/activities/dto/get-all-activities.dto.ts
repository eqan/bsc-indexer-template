import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';
import { Activity } from '../entities/activity.entity';

@ObjectType('GetAllActivities')
export class GetAllActivities {
  @Field(() => [Activity])
  @IsArray()
  items: Activity[];

  @IsNumber()
  @Field(() => Int)
  total: number;
}
