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
import { CustomDataScalar } from './nestedObjectsDto/data.scalar.dto';

export class CreateOnchainOrdersInput {
  @IsNotEmpty({ message: 'Order ID cannot be null' })
  orderId: string;

  @IsBoolean()
  onchain: boolean;

  @IsNotEmpty()
  @IsString()
  fill: string;

  @IsEnum(ORDER_TYPES)
  @IsNotEmpty()
  type: ORDER_TYPES;

  @IsEnum(OrderSide)
  side?: OrderSide;

  @IsEnum(OrderKind)
  @IsOptional()
  kind?: OrderKind;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsNotEmpty()
  @IsString()
  makeStock: string;

  @IsBoolean()
  @IsNotEmpty()
  cancelled: boolean;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsEthereumAddress()
  maker: string;

  @ValidateNested()
  @Type(() => Asset)
  make: Asset;

  @ValidateNested()
  @Type(() => Asset)
  take: Asset;

  @IsString()
  @IsNotEmpty()
  salt: string;

  @ValidateNested()
  @Field(() => CustomDataScalar)
  data: JSON;

  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  end?: number;

  @IsOptional()
  @IsBoolean()
  optionalRoyalties?: boolean;

  @IsOptional()
  @IsNumber()
  makePrice?: number;

  @IsOptional()
  @IsNumber()
  takePrice?: number;

  @IsOptional()
  @IsNumber()
  makePriceUsd?: number;

  @IsOptional()
  @IsNumber()
  takePriceUsd?: number;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsEthereumAddress()
  @IsOptional()
  taker?: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  contract: string;

  @IsString()
  @IsNotEmpty()
  tokenId: string;
}
