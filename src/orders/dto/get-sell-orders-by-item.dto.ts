import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomEnumScalar } from '../common/orders-enum-scalar.common';
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

  @IsOptional()
  @Field(() => CustomEnumScalar, { nullable: true })
  status?: OrderStatus[];
}
