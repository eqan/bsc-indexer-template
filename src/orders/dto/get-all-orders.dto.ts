import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Orders } from '../entities/orders.entity';

@ObjectType('GetAllOrders')
export class GetAllOrders {
  @Field(() => [Orders])
  items: Orders[];

  @Field(() => Int)
  total: number;
}
