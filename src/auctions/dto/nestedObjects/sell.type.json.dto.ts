import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsEthereumAddress } from 'class-validator';
import { AuctionType } from 'src/auctions/entities/enums';

@ObjectType('SellType')
@InputType('SellTypeInput')
export class SellTypeDto {
  @IsEnum(AuctionType)
  @Field(() => AuctionType)
  type: AuctionType;

  @IsEthereumAddress()
  @Field(() => String)
  contract: string;

  @Field(() => String)
  tokenId: string;
}
