import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CustomEnumScalar } from '../common/orders-enum-scalar.common';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetSellOrdersByMakerDto extends PaginationParam {
  @IsNotEmpty()
  @Field(() => [String])
  maker: string[];

  @IsOptional()
  @Field(() => CustomEnumScalar, { nullable: true })
  status?: OrderStatus[];
}
