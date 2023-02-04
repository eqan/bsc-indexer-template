import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomBinaryScalar } from 'src/core/customScalars/binary';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { OrderKind } from '../entities/enums/order.kind.enum';
import { OrderTypesForPlatform } from '../entities/enums/order.order-types.enum';
import { OrderTransaction } from '../entities/enums/order.transaction-type.enum';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { OrderFormAsset } from './nestedObjectsDto/asset.dto';
import { DataDto } from './nestedObjectsDto/data.dto';

@InputType('OrderFormDto')
export class OrderFormDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Field(() => String)
  maker: string;

  @IsEthereumAddress()
  @Field(() => String)
  contract?: string;

  @Field(() => String)
  tokenId?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String, { nullable: true })
  taker?: string;

  @ValidateNested()
  @Field(() => OrderFormAsset)
  @Type(() => OrderFormAsset)
  make: OrderFormAsset;

  @ValidateNested()
  @Field(() => OrderFormAsset)
  @Type(() => OrderFormAsset)
  take: OrderFormAsset;

  @IsString()
  @Field(() => String)
  salt: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  start?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  end?: number;

  @Field(() => CustomBinaryScalar)
  @Type(() => String)
  signature: string;

  @Type(() => DataDto)
  @Field(() => DataDto)
  data: DataDto;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  usdValue?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  takePriceUsd?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  makePriceUsd?: number;

  @IsOptional()
  @IsEnum(OrderTransaction)
  @Field(() => OrderTransaction, { nullable: true })
  type?: OrderTransaction;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  makePrice?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  takePrice?: number;

  @IsString()
  @Field(() => String)
  fill: string;

  @IsEnum(OrderKind)
  @Field(() => OrderKind)
  kind: OrderKind;

  @IsEnum(OrderStatus)
  @Field(() => OrderStatus)
  status: OrderStatus;

  @IsEnum(OrderSide)
  @Field(() => OrderSide)
  side: OrderSide;

  @IsEnum(OrderTypesForPlatform)
  @Field(() => OrderTypesForPlatform)
  platformType: OrderTypesForPlatform;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  makeUsd?: number;

  @Field(() => String, { nullable: true })
  makeStock?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  takeUsd?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  approved?: boolean;

  @IsOptional()
  hash?: Uint8Array;

  @IsBoolean()
  @Field(() => Boolean)
  onchain: boolean;

  @IsBoolean()
  @Field(() => Boolean)
  cancelled: boolean;

  @IsBoolean()
  @Field(() => Boolean)
  optionalRoyalties: boolean;
}
