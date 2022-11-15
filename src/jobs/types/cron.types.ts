import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CronType {
  @Field(() => Boolean)
  isDone?: boolean;
}
