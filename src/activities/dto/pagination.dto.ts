import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationParam {
  @Field({ nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
