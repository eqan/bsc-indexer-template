import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { AuctionStatus, AuctionType } from 'src/auctions/entities/enums';
import { LastBidDataInput } from './lastBid.data.dto';

@ObjectType('LastBid')
@InputType('LastBidInput')
export class LsatBid {
  @Field()
  buyer: string;

  @IsNotEmpty()
  @Field()
  amount: number;

  @Field()
  date: Date;

  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus)
  status: AuctionStatus;

  @IsEnum(AuctionType)
  @Field(() => AuctionType)
  type: AuctionType;

  @ValidateNested()
  @Type(() => LastBidDataInput)
  @Field(() => LastBidDataInput)
  data: LastBidDataInput;
}
