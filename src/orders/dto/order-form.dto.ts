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
import { OrderTransaction } from '../entities/enums/order.transaction-type.enum';
import { OrderFormAsset } from './nestedObjectsDto/asset.dto';
import { DataDto } from './nestedObjectsDto/data.dto';

@InputType('OrderFormDto')
export class OrderFormDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Field(() => String)
  maker: string;

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
  makePrice?: number;

  @IsOptional()
  @IsNumber()
  takePrice?: number;

  @IsOptional()
  @IsNumber()
  makeUsd?: number;

  @IsOptional()
  @IsNumber()
  takeUsd?: number;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  hash?: Uint8Array;
}
