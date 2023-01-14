import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';
import { OrderMatchEvents } from '../entities/events.entity.order-match-events';

@ObjectType('GetAllOrdersMatchEvent')
export class GetAllOrdersMatchEvent {
  @Field(() => [OrderMatchEvents])
  @IsArray()
  items: OrderMatchEvents[];

  @IsNumber()
  @Field(() => Int)
  total: number;
}
