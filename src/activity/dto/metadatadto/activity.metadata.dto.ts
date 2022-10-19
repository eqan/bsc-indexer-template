import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ActivityTypes } from 'src/activity/enums/activity.types.enums';
import { BlockChainInfo } from './blockchaininfo.metadata.dto';

@ObjectType("ActivityMetaData")
@InputType("ActivityMetaData")
export class ActivityMetaData {
  @IsEnum(ActivityTypes)
  @IsNotEmpty()
  @Field()
  type: ActivityTypes;

  @IsEthereumAddress({ message: 'Owner address should be an ethereum address' })
  @IsNotEmpty()
  @Field()
  owner: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  date: Date;
 
  @IsDate()
  @Field()
  lastUpdatedAt: Date;
 
  @IsString()
  @Field()
  cursor: string;
 
  @IsBoolean()
  @Field()
  reverted: boolean;

  @IsEthereumAddress({ message: 'Contract should be an ethereum address' })
  @Field()
  contract: string;

  @IsNumber()
  @Field()
  tokenId: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  activityId: string;
 
  @IsString()
  @IsNotEmpty()
  @Field()
  itemId: string;

  @IsNumber()
  @Field()
  value: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  transactionHash: string;

  @ValidateNested()
  @Type(() => BlockChainInfo)
  @Field(()=> BlockChainInfo)
  blockChainInfo: BlockChainInfo;
}