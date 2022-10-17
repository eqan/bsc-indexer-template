import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PaginationParam {
  @IsOptional()
  @Field({ nullable: true })
  page?: number;

  @IsOptional()
  @Field({ nullable: true })
  limit?: number;
}
