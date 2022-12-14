import { Field, InputType } from '@nestjs/graphql';
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
import { OrderKind } from '../entities/enums/order.kind.enum';
import { ORDER_TYPES } from '../entities/enums/order.order-types.enum';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { Asset } from './nestedObjectsDto/asset-type.dto';
import { CustomDataScalar } from './nestedObjectsDto/data.dto';

@InputType()
export class CreateOrdersInput {
  // @IsEthereumAddress({ message: 'Order ID should be an ethereum address' })
  @IsNotEmpty({ message: 'Order ID cannot be null' })
  @Field()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  fill: number;

  @IsEnum(ORDER_TYPES)
  @IsNotEmpty()
  @Field(() => ORDER_TYPES)
  type: ORDER_TYPES;

  @IsEnum(OrderKind)
  @IsNotEmpty()
  @Field(() => OrderKind)
  kind: OrderKind;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @Field(() => OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  makeStock: number;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  cancelled: boolean;

  @IsNotEmpty()
  @IsDate()
  @Field()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Field()
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @IsEthereumAddress()
  @Field()
  maker: string;

  @ValidateNested()
  @Type(() => Asset)
  @Field(() => Asset)
  make: Asset;

  @ValidateNested()
  @Type(() => Asset)
  @Field(() => Asset)
  take: Asset;

  @IsString()
  @IsNotEmpty()
  @Field()
  salt: string;

  @ValidateNested()
  @Field(() => CustomDataScalar)
  data: JSON;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  start?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  end?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  optionalRoyalties?: boolean;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  dbUpdatedAt?: Date;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  makePrice?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  takePrice?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  makePriceUsd?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  takePriceUsd?: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  signature: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  taker?: string;
}
