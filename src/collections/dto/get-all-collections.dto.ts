import { Field, ObjectType } from '@nestjs/graphql';
import { Collections } from '../entities/collections.entity';

@ObjectType('GetAllCollections')
export class GetAllCollections {
  @Field(() => [Collections])
  items: Collections[];

  @Field()
  total: number;
}
