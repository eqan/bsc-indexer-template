import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterDto extends PaginationParam {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;
}
