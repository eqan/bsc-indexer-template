import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SortOrder } from '../enums/collections.sort-order.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterTokensByPriceRangeDto extends PaginationParam {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  collectionId: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  min?: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  max?: string;

  @IsEnum(() => SortOrder)
  @Field(() => SortOrder)
  sortOrder: SortOrder;
}
