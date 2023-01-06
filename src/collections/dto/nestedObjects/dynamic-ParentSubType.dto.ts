import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class DynamicParentSubTypeData {
  @IsString()
  @Field()
  value: string;

  @Field(() => Int)
  count: number;

  @IsString()
  @Field()
  parent: string;
}
