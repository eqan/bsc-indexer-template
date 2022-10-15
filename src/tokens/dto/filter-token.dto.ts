import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam  } from './pagination.dto'

@InputType()
export class FilterTokenDto extends PaginationParam {
  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  name?: string;
}
