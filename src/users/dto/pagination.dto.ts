import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PaginationParam {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  limit?: number;
}
