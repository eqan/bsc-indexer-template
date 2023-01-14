import { Field, ObjectType } from '@nestjs/graphql';
import { DynamicParentSubTypeData } from './nestedObjects/dynamic-ParentSubType.dto';
import { DynamicParentData } from './nestedObjects/dynamic-ParentType.dto';

@ObjectType()
export class CollectionUniqueItems {
  @Field(() => [DynamicParentData])
  Parent: DynamicParentData[];

  @Field(() => [DynamicParentSubTypeData])
  ParentSubTypes: DynamicParentSubTypeData[];
}
