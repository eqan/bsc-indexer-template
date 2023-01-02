import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class DynamicData {
  @IsString()
  @Field()
  key: string;

  @Field(() => Int)
  count: number;
}
