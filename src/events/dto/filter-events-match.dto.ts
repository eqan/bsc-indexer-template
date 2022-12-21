import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterOrderMatchEvent extends PaginationParam {
  @IsOptional()
  @Field({ nullable: true })
  orderId?: string;

  @IsOptional()
  @Field({ nullable: true })
  tokenId: string;
}
