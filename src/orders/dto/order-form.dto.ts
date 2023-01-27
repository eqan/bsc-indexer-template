import { Field, InputType } from '@nestjs/graphql';
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
  signature: Binary;

  @Type(() => DataDto)
  @Field(() => DataDto)
  data: DataDto;
}
