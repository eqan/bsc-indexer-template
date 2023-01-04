import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetOrderBidsByMakerDto extends PaginationParam {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Field(() => [String])
  maker: string[];

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
  @Field(() => [OrderStatus])
  status?: OrderStatus[];
}
