import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { ActivityType } from '../entities/enums/activity.type.enum';
import { CreateBidActivityInput } from './create-activity.bid.input';
import { CreateActivityMintInput } from './create-activity.mint.input';
import { CreateActivityTransferInput } from './create-activity.transfer.input';
import { BlockChainInfoDto } from './nestedActivityObject/activity.blockchain.info.dto';

@InputType('CreateActivityInput')
export class CreateActivityInput {
  @IsEthereumAddress()
  @Field(() => String)
  id: string;

  // @IsEnum(ActivityType)
  @IsOptional()
  @Field(() => ActivityType)
  type?: ActivityType;

  @IsNotEmpty()
  @Field(() => Date)
  date: Date;

  @IsNotEmpty()
  @Field(() => Date)
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @Field()
  cursor: string;

  @IsNotEmpty()
  @Field()
  reverted: boolean;


  @IsOptional()
  @ValidateNested()
  @Type(() => BlockChainInfoDto)
  @Field(() => BlockChainInfoDto, { nullable: true })
  blockchainInfo?: BlockChainInfoDto;

  //Type Mint
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityMintInput)
  @Field(() => CreateActivityMintInput, { nullable: true })
  MINT?: CreateActivityMintInput;

  //Type Transfer
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityTransferInput)
  @Field(() => CreateActivityTransferInput, { nullable: true })
  TRANSFER?: CreateActivityTransferInput;

  //Type Bid
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBidActivityInput)
  @Field(() => CreateBidActivityInput, { nullable: true })
  createBidActivityInput?: CreateBidActivityInput;

  //Mint
  // @Field()
  // tokenId: string;

  // @Field()
  // value: string;

  // @Field()
  // owner: string;

  // @Field()
  // contract: string;

  // @Field()
  // itemId: string;

  // @Field()
  // transactionHash: string;

  //transfer
  // @Field()
  // from: string;

  // @Field()
  // purchase: boolean;

  //burn

  //bid
}
