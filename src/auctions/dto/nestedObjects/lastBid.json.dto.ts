import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { AuctionStatus, AuctionType } from 'src/auctions/entities/enums/enums';
import { LastBidDataInput } from './lastBid.data.dto';

@ObjectType('LastBid')
@InputType('LastBidInput')
export class LastBid {
  @Field({ nullable: true })
  buyer: string;

  @Field({ nullable: true })
  amount: number;

  @Field({ nullable: true })
  date: Date;

  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus, { nullable: true })
  status: AuctionStatus;

  @IsEnum(AuctionType)
  @Field(() => AuctionType, { nullable: true })
  type: AuctionType;

  @ValidateNested()
  @Type(() => LastBidDataInput)
  @Field(() => LastBidDataInput, { nullable: true })
  data: LastBidDataInput;
}
