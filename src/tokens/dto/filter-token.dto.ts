import { Field, InputType } from '@nestjs/graphql';
import { MetaData } from './nestedObjectDto/meta.dto';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterTokenDto extends PaginationParam {
  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  name: MetaData;
}
