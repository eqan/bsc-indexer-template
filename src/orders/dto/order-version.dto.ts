import { Field } from '@nestjs/graphql';
import { Binary } from '@rarible/types';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomBinaryScalar } from 'src/core/customScalars/binary';
import { Asset } from './nestedObjectsDto/asset-type.dto';
import { CustomDataScalar } from './nestedObjectsDto/data.scalar.dto';
// @Id
// val id: ObjectId = ObjectId(),
// val onChainOrderKey: LogEventKey? = null,
// val createdAt: Instant = nowMillis(),
// val platform: Platform = Platform.RARIBLE,
// val type: OrderType,
// val salt: EthUInt256,
// val start: Long?,
// val end: Long?,
// val data: OrderData,
// val hash: Word = Order.hashKey(maker, make.type, take.type, salt.value, data),
// val approved: Boolean = true

export class OrderVersionDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  maker: string;

  @IsOptional()
  @IsEthereumAddress()
  taker?: string;

  @ValidateNested()
  @Type(() => Asset)
  make: Asset;

  @ValidateNested()
  @Type(() => Asset)
  take: Asset;

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

  @IsOptional()
  @IsNumber()
  makeUsd?: number;

  @IsOptional()
  @IsNumber()
  takeUsd?: number;

  @IsString()
  salt: string;

  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  end?: number;

  @IsOptional()
  @Field(() => CustomBinaryScalar)
  signature?: Binary;

  @Field(() => CustomDataScalar)
  data: JSON;
}
