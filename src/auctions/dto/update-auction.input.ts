import { CreateAuctionInput } from './create-auction.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AuctionStatus } from '../entities/enums';

@InputType('UpdateAuctionStatusInput')
export class UpdateAuctionInput extends PartialType(CreateAuctionInput) {
  @IsNotEmpty()
  @Field(() => Int)
  auctionId: number;

  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus)
  status?: AuctionStatus;
}
