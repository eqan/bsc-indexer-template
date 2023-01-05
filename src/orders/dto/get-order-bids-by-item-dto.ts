import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetOrderBidsByItemDto extends PaginationParam {
  @IsString()
  @IsNotEmpty()
  @Field()
  itemId: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  maker?: string[];

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  start?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  end?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus[];
}
