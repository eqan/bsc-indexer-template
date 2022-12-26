import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';

@InputType()
export class UpdateOrderStatus {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  orderId: string;

  @IsEnum(OrderStatus)
  @Field(() => OrderStatus)
  status: OrderStatus;

  @IsNotEmpty({ message: 'cancelled should be true or false' })
  @IsBoolean()
  @Field()
  cancelled: boolean;
}
