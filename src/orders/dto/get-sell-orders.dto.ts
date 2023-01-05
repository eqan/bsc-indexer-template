import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

@InputType()
export class GetSellOrdersDto extends PaginationParam {
  @IsEnum(OrderStatus)
  @IsOptional()
  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus[];
}
