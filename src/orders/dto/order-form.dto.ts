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
import { Asset } from './nestedObjectsDto/asset.dto';
import { Data } from './nestedObjectsDto/data.dto';
import { CustomDataScalar } from './nestedObjectsDto/data.scalar.dto';
export class OrderFormDto {
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

  @Type(() => Data)
  @Field(() => CustomDataScalar)
  data: Data;
}
