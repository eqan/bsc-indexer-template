import { Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { OrderKind } from '../entities/enums/order.kind.enum';
import { ORDER_TYPES } from '../entities/enums/order.order-types.enum';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { Asset } from './nestedObjectsDto/asset-type.dto';
import { CustomDataScalar } from './nestedObjectsDto/data.dto';
import { OrderAvailability } from '../entities/enums/order.availability.enum';

// @InputType()
export class CreateOnchainOrdersInput {
  // @IsEthereumAddress({ message: 'Order ID should be an ethereum address' })
  @IsNotEmpty({ message: 'Order ID cannot be null' })
  //   @Field()
  orderId: string;

  @IsEnum(OrderAvailability)
  availability: OrderAvailability;

  @IsNotEmpty()
  @IsString()
  //   @Field()
  fill: string;

  @IsEnum(ORDER_TYPES)
  @IsNotEmpty()
  //   @Field(() => ORDER_TYPES)
  type: ORDER_TYPES;

  @IsEnum(OrderSide)
  //   @Field(() => OrderSide)
  side?: OrderSide;

  @IsEnum(OrderKind)
  @IsOptional()
  //   @Field(() => OrderKind)
  kind?: OrderKind;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  //   @Field(() => OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsString()
  //   @Field()
  makeStock: string;

  @IsBoolean()
  @IsNotEmpty()
  //   @Field()
  cancelled: boolean;

  @IsNotEmpty()
  @IsDate()
  //   @Field()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  //   @Field()
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @IsEthereumAddress()
  @IsEthereumAddress()
  //   @Field()
  maker: string;

  @ValidateNested()
  @Type(() => Asset)
  //   @Field(() => Asset)
  make: Asset;

  @ValidateNested()
  @Type(() => Asset)
  //   @Field(() => Asset)
  take: Asset;

  @IsString()
  @IsNotEmpty()
  //   @Field()
  salt: string;

  @ValidateNested()
  @Field(() => CustomDataScalar)
  data: JSON;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  start?: number;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  end?: number;

  @IsOptional()
  @IsBoolean()
  //   @Field({ nullable: true })
  optionalRoyalties?: boolean;

  @IsOptional()
  @IsDate()
  //   @Field({ nullable: true })
  dbUpdatedAt?: Date;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  makePrice?: number;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  takePrice?: number;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  makePriceUsd?: number;

  @IsOptional()
  @IsNumber()
  //   @Field({ nullable: true })
  takePriceUsd?: number;

  @IsString()
  @IsNotEmpty()
  //   @Field()
  signature: string;

  @IsEthereumAddress()
  @IsOptional()
  @IsEthereumAddress()
  //   @Field({ nullable: true })
  taker?: string;
}
