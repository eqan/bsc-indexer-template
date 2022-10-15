import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  collectionId?: string;

  @Field({ nullable: true, defaultValue: undefined })
  name?: string;
}
