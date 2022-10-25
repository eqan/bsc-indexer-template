import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterActivityDto extends PaginationParam {
  @IsString()
  @Field()
  id: string;
}