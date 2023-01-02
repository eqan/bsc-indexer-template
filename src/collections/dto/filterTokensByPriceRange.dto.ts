import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from '../enums/collections.sort-order.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterTokensByPriceRangeDto extends PaginationParam {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  collectionId: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  min?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  max?: number;

  @IsEnum(SortOrder)
  @Field(() => SortOrder)
  sortOrder?: SortOrder;
}
