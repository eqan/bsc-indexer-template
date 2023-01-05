import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetSellOrdersByItemDto extends PaginationParam {
  @IsOptional()
  @Field(() => [String], { nullable: true })
  maker?: string[];

  @IsString()
  @IsNotEmpty()
  @Field()
  itemId: string;

  @IsEnum([OrderStatus])
  @IsOptional()
  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus[];
}
