import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@ObjectType("BlockChainInfo")
@InputType("BlockChainInfo")
export class BlockChainInfo {
  @IsString()
  @IsNotEmpty()
  @Field()
  transactionHash: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  blockHash: string;

  @IsInt()
  @IsNotEmpty()
  @Field()
  blockNumber: Number;

  @IsInt()
  @IsNotEmpty()
  @Field()
  logIndex: Number;
}