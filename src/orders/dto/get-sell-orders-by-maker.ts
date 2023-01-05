import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetSellOrdersByMakerDto extends PaginationParam {
  // @IsEthereumAddress()
  @IsNotEmpty()
  @Field(() => [String])
  maker: string[];

  @IsEnum(OrderStatus)
  @IsOptional()
  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus[];
}
