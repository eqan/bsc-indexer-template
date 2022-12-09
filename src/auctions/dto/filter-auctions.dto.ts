import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterAuctionDto extends PaginationParam {
  @IsOptional()
  @Field({ nullable: true })
  auctionId?: number;

  @IsOptional()
  @Field({ nullable: true })
  contract?: string;

  @IsOptional()
  @Field({ nullable: true })
  seller?: string;
}
