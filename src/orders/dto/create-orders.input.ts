import { Field, InputType } from '@nestjs/graphql';
import { isOptionalChain } from '@ts-morph/common/lib/typescript';
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
  @IsOptional()
  @Field({ nullable: true })
  startedAt?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endedAt?: Date;

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
  makePriceUsed?: number;

  @IsOptional()
  @Field({ nullable: true })
  takePriceUsed?: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  signature: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  taker?: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  dataType: string;
}
