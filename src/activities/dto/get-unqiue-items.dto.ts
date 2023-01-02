import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ObjectType('GetUniqueTokenItems')
export class GetUniqueTokenItems {
  @Field()
  @IsArray()
  items: object;
}
