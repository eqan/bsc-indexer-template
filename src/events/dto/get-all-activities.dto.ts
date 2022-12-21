import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';
import { OrderMatchEvent } from '../entities/events.entity.order-match-events';

@ObjectType('GetAllOrdersMatchEvent')
export class GetAllOrdersMatchEvent {
  @Field(() => [OrderMatchEvent])
  @IsArray()
  items: OrderMatchEvent[];

  @IsNumber()
  @Field(() => Int)
  total: number;
}
