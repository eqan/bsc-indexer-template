import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JoinColumn, OneToOne } from 'typeorm';
import { ActivityType } from '../entities/enums/activity.type.enum';
import { CreateBidActivityInput } from './create-activity.bid.input';
import { CreateActivityBurnInput } from './create-activity.burn.input';
import { CreateActivityMintInput } from './create-activity.mint.input';
import { CreateActivityTransferInput } from './create-activity.transfer.input';
import { BlockChainInfoDto } from './nestedActivityObject/activity.blockchain.info.dto';

@InputType('CreateActivityInput')
export class CreateActivityInput {
  @IsEthereumAddress()
  @Field(() => String)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  collectionId: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityMintInput)
  @Field(() => CreateActivityMintInput, { nullable: true })
  MINT?: CreateActivityMintInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityTransferInput)
  @Field(() => CreateActivityTransferInput, { nullable: true })
  TRANSFER?: CreateActivityTransferInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBidActivityInput)
  @Field(() => CreateBidActivityInput, { nullable: true })
  BID?: CreateBidActivityInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateActivityBurnInput)
  @Field(() => CreateActivityBurnInput, { nullable: true })
  BURN?: CreateActivityBurnInput;
}
