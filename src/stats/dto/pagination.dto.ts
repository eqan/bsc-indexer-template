import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationParam {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;
}
