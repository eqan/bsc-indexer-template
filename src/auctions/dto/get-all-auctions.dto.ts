import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Auction } from '../entities/auction.entity';
@ObjectType('GetAllAuctions')
export class GetAllAuctions {
  @Field(() => [Auction])
  items: Auction[];

  @Field(() => Int)
  total: number;
}
