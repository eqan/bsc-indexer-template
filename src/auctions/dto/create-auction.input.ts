import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AuctionStatus, AuctionType } from '../entities/enums/enums';
import { DataInput } from './nestedObjects/data.json.dto';
import { LsatBid } from './nestedObjects/lastBid.json.dto';
import { Sell } from './nestedObjects/sell.json.dto';
import { SellTypeDto } from './nestedObjects/sell.type.json.dto';

@InputType()
export class CreateAuctionInput {
  @IsNotEmpty()
  @Field()
  auctionId: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  @Field()
  seller: string;

  @IsEnum(AuctionType)
  @Field(() => AuctionType)
  type: AuctionType;

  @ValidateNested()
  @Type(() => Sell)
  @Field(() => Sell)
  sell: Sell;

  @ValidateNested()
  @Type(() => SellTypeDto)
  @Field(() => SellTypeDto)
  buy: SellTypeDto;

  @IsNotEmpty()
  @Field(() => Date)
  endTime: Date;

  @IsNotEmpty()
  @Field()
  minimalStep: number;

  @IsNotEmpty()
  @Field()
  minimalPrice: number;

  @IsNotEmpty()
  @Field(() => Date)
  createdAt: Date;

  @IsNotEmpty()
  @Field(() => Date)
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @Field()
  buyPrice: number;

  @IsNotEmpty()
  @Field()
  buyPriceUsd: number;

  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus)
  status: AuctionStatus;

  @IsNotEmpty()
  @Field()
  ongoing: boolean;

  @Field()
  hash: string;

  @ValidateNested()
  @Type(() => LsatBid)
  @Field(() => LsatBid)
  lastBid: LsatBid;

  @ValidateNested()
  @Type(() => DataInput)
  @Field(() => DataInput)
  data: DataInput;
}
