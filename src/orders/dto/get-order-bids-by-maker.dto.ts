import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CustomEnumScalar } from '../common/orders-enum-scalar.common';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetOrderBidsByMakerDto extends PaginationParam {
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

  @IsOptional()
  @Field(() => CustomEnumScalar, { nullable: true })
  status?: OrderStatus[];
}
