import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterAuctionDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  auctionId?: number;

  @Field({ nullable: true, defaultValue: undefined })
  contract?: string;
}
