import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginationParam {
  @IsNumber()
  @Field({ nullable: true })
  page?: number;

  @IsNumber()
  @Field(() => Int, { nullable: true })
  limit?: number;
}
