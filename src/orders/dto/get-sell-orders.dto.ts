import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CustomEnumScalar } from '../common/orders-enum-scalar.common';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetSellOrdersDto extends PaginationParam {
  @IsOptional()
  @Field(() => CustomEnumScalar, { nullable: true })
  status?: OrderStatus[];
}
