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
  @IsNumber()
  @Field()
  fill: number;

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
  @Type(() => Make)
  @Field(() => Make)
  Make: Make;

  @ValidateNested()
  @Type(() => Make)
  @Field()
  Take: Make;

  @IsString()
  @IsNotEmpty()
  @Field()
  salt: string;

  @ValidateNested()
  @Type(() => Data)
  @Field()
  data: Data;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  startedAt?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  endedAt?: Date;

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
  makePriceUsed?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  takePriceUsed?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  signature?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  taker?: string;
}
