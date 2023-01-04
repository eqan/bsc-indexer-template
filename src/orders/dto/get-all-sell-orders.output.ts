import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Orders } from '../entities/orders.entity';

@ObjectType('GetAllSellOrders')
export class GetAllSellOrders {
  @Field(() => [Orders])
  items: Orders[];

  @Field(() => Int)
  total: number;
}
