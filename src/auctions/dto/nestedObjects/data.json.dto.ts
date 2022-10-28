import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { AuctionDataType } from 'src/auctions/entities/enums';
import { Payouts } from './payouts.json.dto';

@ObjectType('AuctionData')
@InputType('AuctionDataInput')
export class DataInput {
  @IsEnum(AuctionDataType)
  @Field(() => AuctionDataType)
  dataType: AuctionDataType;

  @IsDate()
  @Field(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @Field()
  duration: number;

  @IsNotEmpty()
  @Field()
  buyOutPrice: number;

  @ValidateNested()
  @Type(() => Payouts)
  @Field(() => Payouts)
  originFees: Payouts;

  @ValidateNested()
  @Type(() => Payouts)
  @Field(() => Payouts)
  payouts: Payouts;
}
