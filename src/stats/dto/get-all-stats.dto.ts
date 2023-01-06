import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';
import { Stats } from '../entities/stats.entity';

@ObjectType('GetAllStats')
export class GetAllStats {
  @Field(() => [Stats])
  @IsArray()
  items: Stats[];

  @IsNumber()
  @Field(() => Int)
  total: number;
}
