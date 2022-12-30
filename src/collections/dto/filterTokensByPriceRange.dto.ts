import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SortOrder } from '../enums/collections.sort-order.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterTokensByPriceRangeDto extends PaginationParam {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  collectionId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  min: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  max: string;

  @IsEnum(SortOrder)
  @Field(() => SortOrder)
  sortOrder: SortOrder;
}
