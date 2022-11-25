import { CreateAuctionInput } from './create-auction.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AuctionStatus } from '../entities/enums/enums';

@InputType('UpdateAuctionStatusInput')
export class UpdateAuctionInput extends PartialType(CreateAuctionInput) {
  @IsNotEmpty()
  @Field()
  auctionId: number;

  @IsEnum(AuctionStatus)
  @Field(() => AuctionStatus)
  status?: AuctionStatus;
}
