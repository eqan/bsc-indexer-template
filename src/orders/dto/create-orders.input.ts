import { Field, InputType } from '@nestjs/graphql';
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

  // @IsEthereumAddress()
  @IsNotEmpty()
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

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  start?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  end?: Date;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  optionalRoyalties?: boolean;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  dbUpdatedAt?: Date;

  @IsOptional()
  @Field({ nullable: true })
  makePrice?: number;

  @IsOptional()
  @Field({ nullable: true })
  takePrice?: number;

  @IsOptional()
  @Field({ nullable: true })
  makePriceUsd?: number;

  @IsOptional()
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
