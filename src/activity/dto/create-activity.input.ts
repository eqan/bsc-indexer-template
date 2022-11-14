import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ActivityTypes } from '../entities/enums/activity.types.enums';
import { BlockChainInfo } from './nestedObjectDto/blockchaininfo.metadata.dto';

@InputType()
export class CreateActivityInput {
  // @Field()
  // @IsNotEmpty()
  // @IsString()
  // id: string;

  @IsEnum(ActivityTypes)
  @IsNotEmpty()
  @Field(()=> ActivityTypes)
  type: ActivityTypes;

  @IsEthereumAddress({ message: 'Owner address should be an ethereum address' })
  @IsNotEmpty()
  @Field()
  owner: string;

  // @IsDate()
  // @IsNotEmpty()
  // @Field()
  // date: Date;
 
  // @IsDate()
  // @Field()
  // lastUpdatedAt: Date;
 
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
  itemId: string;

  @IsNumber()
  @Field()
  value: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  transactionHash: string;

  @Field(()=> BlockChainInfo)
  blockChainInfo: {
    transactionHash: string,
    blockHash: string,
    blockNumber: number,
    logIndex: number
  };
}