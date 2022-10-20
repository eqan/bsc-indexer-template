import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';

@InputType()
export class UpdateOrderStatus {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  orderId: string;

  @IsEnum(OrderStatus)
  @Field()
  status: OrderStatus;
}
