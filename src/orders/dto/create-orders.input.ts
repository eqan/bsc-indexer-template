import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { Data } from './nestedObjectsDto/data.object';
import { Make } from './nestedObjectsDto/make.dto';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
@InputType()
export class CreateOrdersInput {
  @IsEthereumAddress({ message: 'Order ID should be an ethereum address' })
  @IsNotEmpty({ message: 'Order ID cannot be null' })
  @Field()
  orderId: string;

  @IsNotEmpty()
  @Field()
  fill: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @Field(() => OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @Field()
  makeStock: number;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  cancelled: boolean;

  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @Field()
  lastUpdatedAt: Date;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  maker: string;

  @ValidateNested()
  @Type(() => Make)
  @Field(() => Make)
  Make: Make;

  @ValidateNested()
  @Type(() => Make)
  @Field()
  take: Make;

  @IsString()
  @IsNotEmpty()
  @Field()
  salt: string;

  @ValidateNested()
  @Type(() => Data)
  @Field()
  data: Data;

  @IsDate()
  @Field()
  startedAt?: Date;

  @IsDate()
  @Field()
  endedAt?: Date;

  @IsBoolean()
  @Field()
  optionalRoyalties?: boolean;

  @IsDate()
  @Field()
  dbUpdatedAt?: Date;

  @IsOptional()
  @Field()
  makePrice?: number;

  @IsOptional()
  @Field()
  takePrice?: number;

  @IsOptional()
  @Field()
  makePriceUsed?: number;

  @IsOptional()
  @Field()
  takePriceUsed?: number;

  @IsOptional()
  @IsString()
  @Field()
  signature?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  taker?: string;
}
