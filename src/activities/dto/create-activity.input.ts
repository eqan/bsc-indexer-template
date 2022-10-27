import { InputType, Int, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ActivityType } from '../entities/enums/activity.type.enum';
import { CreateBidActivityInput } from './create-activity.bid.input';
import { CreateActivityMintInput } from './create-activity.mint.input';
import { CreateActivityTransferInput } from './create-activity.transfer.input';
import { BlockChainInfoDto } from './nestedActivityObject/activity.blockchain.info.dto';
import { Make } from './nestedActivityObject/make.dto';

@InputType('CreateActivityInput')
export class CreateActivityInput {
  // @IsEnum(ActivityType)
  @IsOptional()
  @Field(() => ActivityType)
  type?: ActivityType;

  // @IsEnum(ActivityType)
  // @IsOptional()
  // @Field(() => ActivityType)
  // ActivityType?: ActivityType;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field(() => String)
  activityId: string;

  @IsNotEmpty()
  @Field(() => Date)
  date: Date;

  @Field()
  lastUpdatedAt: Date;

  @Field()
  cursor: string;

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
  @Type(() => CreateActivityMintInput,{
    // discriminator: {
    //   property: '',
    //   subTypes: [

    //   ]
    // }
  })
  @Field(() => CreateActivityMintInput, { nullable: true })
  MINT?: CreateActivityMintInput;

  //Type Transfer
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityTransferInput)
  @Field(() => CreateActivityTransferInput, { nullable: true })
  TRANSFER?: CreateActivityTransferInput;

  //Type Bid
  @ValidateNested()
  @Type(() => CreateBidActivityInput)
  @IsOptional()
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
