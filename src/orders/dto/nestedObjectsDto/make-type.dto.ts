import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional
} from 'class-validator';
import { OrderType } from 'src/orders/entities/enums/order.type.enum';

@ObjectType('MakeType')
@InputType('MakeTypeInput')
export class MakeType {
  @IsEnum(OrderType)
  @Field(() => OrderType)
  type: OrderType;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsOptional()
  @Field(() => Int)
  tokenId?: number;
}
