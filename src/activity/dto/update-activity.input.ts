import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ActivityTypes } from '../enums/activity.types.enums';
import { BlockChainInfo } from './nestedObjectDto/blockchaininfo.metadata.dto';

@InputType()
export class UpdateActivity {
  @Field()
  @IsNotEmpty({ message: 'Activity ID cannot be null' })
  id: string;

  @IsEnum(ActivityTypes)
  @Field(()=> ActivityTypes)
  type: ActivityTypes;

  @IsEthereumAddress({ message: 'Owner address should be an ethereum address' })
  @Field()
  owner: string;

  // @IsDate()
  // @Field()
  // lastUpdatedAt: Date;
 
  @IsString()
  @Field()
  cursor: string;
 
  @IsBoolean()
  @Field()
  reverted: boolean;

  // @IsEthereumAddress({ message: 'Contract should be an ethereum address' })
  // @Field()
  // contract: string;

  // @IsNumber()
  // @Field()
  // tokenId: number;

  @IsString()
  @Field()
  itemId: string;

  @IsNumber()
  @Field()
  value: number;

  @IsString()
  @Field()
  transactionHash: string;

  @Field(()=>BlockChainInfo)
  blockChainInfo: {
    transactionHash: string,
    blockHash: string,
    blockNumber: number,
    logIndex: number
  };
}