import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { AuctionDataType } from 'src/auctions/entities/enums/enums';
import { Payouts } from './payouts.json.dto';

@ObjectType('LastBidData')
@InputType('LastBidDataInput')
export class LastBidDataInput {
  @IsEnum(AuctionDataType)
  @Field(() => AuctionDataType)
  dataType: AuctionDataType;

  @ValidateNested()
  @Type(() => Payouts)
  @Field(() => Payouts)
  originFees: Payouts;

  @ValidateNested()
  @Type(() => Payouts)
  @Field(() => Payouts)
  payouts: Payouts;
}
