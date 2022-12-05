import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PaginationParam {
  @IsOptional()
  @Field(() => Number, { nullable: true })
  page?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  limit?: number;
}
