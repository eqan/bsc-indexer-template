import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AuctionStatus, AuctionType } from '../entities/enums/enums';
import { DataInput } from './nestedObjects/data.json.dto';
import { LastBid } from './nestedObjects/lastBid.json.dto';
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

  @IsOptional()
  @IsEnum(AuctionType)
  @Field(() => AuctionType, { nullable: true })
  type?: AuctionType;

  @ValidateNested()
  @IsOptional()
  @Type(() => Sell)
  @Field(() => Sell, { nullable: true })
  sell?: Sell;

  @IsOptional()
  @ValidateNested()
  @Type(() => SellTypeDto)
  @Field(() => SellTypeDto, { nullable: true })
  buy?: SellTypeDto;

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

  @IsOptional()
  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus, { nullable: true })
  status?: AuctionStatus;

  @IsNotEmpty()
  @Field()
  ongoing: boolean;

  @IsOptional()
  @Field({ nullable: true })
  hash?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LastBid)
  @Field(() => LastBid, { nullable: true })
  lastBid?: LastBid;

  @IsOptional()
  @ValidateNested()
  @Type(() => DataInput)
  @Field(() => DataInput, { nullable: true })
  data?: DataInput;
}
